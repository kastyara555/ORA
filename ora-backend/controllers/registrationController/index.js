const { Sequelize } = require("sequelize");
const fs = require("fs");

const {
  saloonRegistrationSchema,
} = require("../../schemas/saloonRegistrationSchema");
const {
  masterRegistrationSchema,
} = require("../../schemas/masterRegistrationSchema");
const {
  userRegistrationSchema,
} = require("../../schemas/userRegistrationSchema");
const { credentialsAvailabilitySchema } = require("../../schemas/credentialsAvailabilitySchema");
const { connection } = require("../../db/connection");
const { userStatuses } = require("../../db/consts/userStatuses");
const { STREET_TYPES } = require("../../db/consts/streetTypes");
const { roles } = require("../../db/consts/roles");
const SaloonGroupProcedureMap = require("../../db/models/SaloonGroupProcedureMap");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const UserTypeMap = require("../../db/models/UserTypeMap");
const StreetType = require("../../db/models/StreetType");
const ClientInfo = require("../../db/models/ClientInfo");
const MasterInfo = require("../../db/models/MasterInfo");
const UserStatus = require("../../db/models/UserStatus");
const SaloonInfo = require("../../db/models/SaloonInfo");
const UserImage = require("../../db/models/UserImage");
const UserType = require("../../db/models/UserType");
const Service = require("../../db/models/Service");
const User = require("../../db/models/User");
const { generateHash } = require("../../utils/hash");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { sendRegistrationMail } = require("../../email");

const registrationSaloon = async (req, res) => {
  const transaction = await connection.transaction();

  try {
    const { value, error } = saloonRegistrationSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const {
      aboutForm,
      emailForm,
      passwordForm,
      adressTypeForm,
      adressForm,
      visitPaymentForm,
      timeForm,
      categoriesForm,
      stuffCountForm,
      servicesForm,
      picturesForm,
    } = value;

    const UserModel = await User(connection);
    const SaloonInfoModel = await SaloonInfo(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const UserTypeModel = await UserType(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const SaloonGroupProcedureMapModel = await SaloonGroupProcedureMap(
      connection
    );
    const ServiceModel = await Service(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserImageModel = await UserImage(connection);
    const StreetTypeModel = await StreetType(connection);

    const suspectPicture = picturesForm.pictures.find(
      ({ data, fileName, fileType }) =>
        data.indexOf(",") === -1 ||
        fileType.indexOf("image/") !== 0 ||
        fileName.indexOf(".") < 1 ||
        !IMAGE_EXTENSIONS.includes(fileName.split(".")[1])
    );

    if (suspectPicture) {
      return res.status(400).send("Неверный формат/размер изображения.");
    }

    const existsUsers = await UserModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            email: emailForm.email,
          },
          {
            phone: aboutForm.phone,
          },
        ],
      },
    });

    if (existsUsers.length) {
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );
    }

    const addedUser = await UserModel.create(
      {
        name: aboutForm.name,
        email: emailForm.email,
        phone: aboutForm.phone,
        password: generateHash(passwordForm.password),
      },
      { transaction }
    );

    const isSelfEmployed = stuffCountForm.count === 1;
    const { hasAdress } = adressTypeForm;

    const { dataValues: activeUserStatus } = await UserStatusModel.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: saloonType } = await UserTypeModel.findOne({
      where: {
        name: roles.saloon.name,
      },
    });

    const { dataValues: addedUserSaloonType } = await UserTypeMapModel.create(
      {
        idUser: addedUser.id,
        idUserType: saloonType.id,
        idUserStatus: activeUserStatus.id,
        hash: generateHash(`${addedUser.id}-${saloonType.id}`),
        bonusCount: 0,
      },
      { transaction }
    );

    const { dataValues: defaultStreetType } = await StreetTypeModel.findOne({
      where: {
        name: STREET_TYPES.STREET.name,
      },
    });

    await SaloonInfoModel.create(
      {
        idCity: adressForm.city,
        idStreetType: hasAdress ? adressForm.streetType : defaultStreetType.id,
        idUserTypeMap: addedUserSaloonType.id,
        street: hasAdress ? adressForm.street : "",
        building: hasAdress ? adressForm.building : "",
        stage: hasAdress ? adressForm.stage : "",
        office: hasAdress ? adressForm.office : "",
        visitPayment: visitPaymentForm.payment,
        workingTime: timeForm.timeLine,
        description: aboutForm.description,
        name: aboutForm.saloonName,
      },
      { transaction }
    );

    await SaloonGroupProcedureMapModel.bulkCreate(
      categoriesForm.categories.map((categoryId) => ({
        idProcedureGroup: categoryId,
        idUserTypeMap: addedUserSaloonType.id,
      })),
      { transaction }
    );

    if (isSelfEmployed) {
      const { dataValues: masterType } = await UserTypeModel.findOne({
        where: {
          name: roles.master.name,
        },
      });

      const { dataValues: addedUserMasterType } = await UserTypeMapModel.create(
        {
          idUser: addedUser.id,
          idUserType: masterType.id,
          idUserStatus: activeUserStatus.id,
          hash: generateHash(`${addedUser.id}-${masterType.id}`),
          bonusCount: 0,
        },
        { transaction }
      );

      await MasterInfoModel.create(
        {
          idUserTypeMap: addedUserMasterType.id,
          description: "",
        },
        { transaction }
      );

      await SaloonMasterMapModel.create(
        {
          idMaster: addedUserMasterType.id,
          idSaloon: addedUserSaloonType.id,
        },
        { transaction }
      );

      if (servicesForm.services.length) {
        const addedServices = await ServiceModel.bulkCreate(
          servicesForm.services.map(({ procedureId, time }) => ({
            idSaloon: addedUserSaloonType.id,
            idProcedure: procedureId,
            description: "",
            time: `${time.hours < 10 ? "0".concat(time.hours) : time.hours}:${time.minutes < 10 ? "0".concat(time.minutes) : time.minutes
              }`,
          })),
          { returning: true, transaction }
        );

        await ServiceMasterMapModel.bulkCreate(
          addedServices.map(({ dataValues }, index) => ({
            idService: dataValues.id,
            idMaster: addedUserMasterType.id,
            price: servicesForm.services[index].price,
          })),
          { transaction }
        );
      }
    }

    for (const { data, fileName } of picturesForm.pictures) {
      const dirName = "/userUploads/" + addedUserSaloonType.id + "/images/";
      const fullDirName = "public" + dirName;
      const imageName = dirName + fileName;
      const fullImageName = "public" + imageName;

      if (!fs.existsSync(fullDirName)) {
        fs.mkdirSync(fullDirName, { recursive: true });
      }

      let buff = new Buffer.from(data.split(",")[1], "base64");
      fs.writeFileSync(fullImageName, buff);

      await UserImageModel.create(
        {
          idUserTypeMap: addedUserSaloonType.id,
          url: imageName,
          isMain: false,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.send(addedUser);
  } catch (e) {
    await transaction.rollback();
    res.status(500).send();
  }
};

const registrationUser = async (req, res) => {
  const transaction = await connection.transaction();

  try {
    const { value, error } = userRegistrationSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { email, phone, name, lastName, password, birthday, sex, agree } =
      value;

    const UserModel = await User(connection);
    const ClientInfoModel = await ClientInfo(connection);
    const UserTypeModel = await UserType(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserTypeMapModel = await UserTypeMap(connection);

    const existsUsers = await UserModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            email,
          },
          {
            phone,
          },
        ],
      },
    });

    if (existsUsers.length) {
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );
    }

    const addedUser = await UserModel.create(
      {
        name,
        email,
        phone,
        password: generateHash(password),
      },
      { transaction }
    );

    const { dataValues: userTypesToBeCreated } = await UserTypeModel.findOne({
      where: {
        name: roles.client.name,
      },
    });

    const { dataValues: activeUserStatus } = await UserStatusModel.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: addedUserClientType } = await UserTypeMapModel.create(
      {
        idUser: addedUser.id,
        idUserType: userTypesToBeCreated.id,
        idUserStatus: activeUserStatus.id,
        hash: generateHash(`${addedUser.id}-${userTypesToBeCreated.id}`),
        bonusCount: 0,
      },
      { transaction }
    );

    await ClientInfoModel.create(
      {
        idUserTypeMap: addedUserClientType.id,
        idSex: sex,
        birthday,
        lastName,
        agree,
      },
      { transaction }
    );

    sendRegistrationMail({
      to: email,
      username: name,
    });

    await transaction.commit();
    res.send(addedUser);
  } catch (e) {
    await transaction.rollback();
    res.status(500).send();
  }
};

const registrationMaster = async (req, res) => {
  const transaction = await connection.transaction();

  try {
    const { value, error } = masterRegistrationSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { name, email, phone, password, description, relatedSaloonMapId } =
      value;

    const UserModel = await User(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const UserTypeModel = await UserType(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);

    const existsUsers = await UserModel.findAll({
      where: {
        [Sequelize.Op.or]: [
          {
            email,
          },
          {
            phone,
          },
        ],
      },
    });

    if (existsUsers.length) {
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );
    }

    if (relatedSaloonMapId) {
      const { dataValues: saloonUserTypeData } = await UserTypeModel.findOne({
        where: {
          name: roles.saloon.name,
        },
      });

      const saloonToBeRelated = await UserTypeMapModel.findOne({
        where: {
          id: relatedSaloonMapId,
          idUserType: saloonUserTypeData.id,
        },
      });

      if (!saloonToBeRelated) {
        return res
          .status(400)
          .send("Салон, на который ссылается форма не существует.");
      }
    }

    const addedUser = await UserModel.create(
      {
        name,
        email,
        phone,
        password: generateHash(password),
      },
      { transaction }
    );

    const { dataValues: userTypesToBeCreated } = await UserTypeModel.findOne({
      where: {
        name: roles.master.name,
      },
    });

    const { dataValues: activeUserStatus } = await UserStatusModel.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: addedMasterType } = await UserTypeMapModel.create(
      {
        idUser: addedUser.id,
        idUserType: userTypesToBeCreated.id,
        idUserStatus: activeUserStatus.id,
        hash: generateHash(`${addedUser.id}-${userTypesToBeCreated.id}`),
        bonusCount: 0,
      },
      { transaction }
    );

    await MasterInfoModel.create(
      {
        idUserTypeMap: addedMasterType.id,
        description,
      },
      { transaction }
    );

    if (relatedSaloonMapId) {
      await SaloonMasterMapModel.create(
        {
          idMaster: addedMasterType.id,
          idSaloon: relatedSaloonMapId,
        },
        { transaction }
      );
    }

    sendRegistrationMail({
      to: email,
      username: name,
    });

    await transaction.commit();
    res.send(addedUser);
  } catch (e) {
    await transaction.rollback();
    res.status(500).send();
  }
};

const checkCredentialsAvailability = async (req, res) => {
  try {
    const { value, error } = credentialsAvailabilitySchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { email, phone } = value;

    const UserModel = await User(connection);

    let userConditions = [];

    if (email) {
      userConditions.push({ email });
    }

    if (phone) {
      userConditions.push({ phone });
    }

    if (!userConditions.length) {
      res.status(400).send('Должен быть указан как минимум один критерий проверки.');
    }

    const existsUsers = await UserModel.findAll({
      where: {
        [Sequelize.Op.or]: userConditions,
      },
    });

    res.send({ available: !existsUsers.length });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  registrationSaloon,
  registrationUser,
  registrationMaster,
  checkCredentialsAvailability
};
