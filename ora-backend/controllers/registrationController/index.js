const { Sequelize } = require("sequelize");
const fs = require("fs");

const { connection } = require("../../db/connection");
const {
  saloonRegistrationSchema,
} = require("../../schemas/saloonRegistrationSchema");
const User = require("../../db/models/User");
const SaloonInfo = require("../../db/models/SaloonInfo");
const UserType = require("../../db/models/UserType");
const UserStatus = require("../../db/models/UserStatus");
const SaloonGroupProcedureMap = require("../../db/models/SaloonGroupProcedureMap");
const UserTypeMap = require("../../db/models/UserTypeMap");
const Service = require("../../db/models/Service");
const ServiceSexPriceMap = require("../../db/models/ServiceSexPriceMap");
const Sex = require("../../db/models/Sex");
const ClientInfo = require("../../db/models/ClientInfo");
const MasterInfo = require("../../db/models/MasterInfo");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const { roles } = require("../../db/consts/roles");
const { userStatuses } = require("../../db/consts/userStatuses");
const {
  userRegistrationSchema,
} = require("../../schemas/userRegistrationSchema");
const { generateHash } = require("../../utils/hash");
const UserImage = require("../../db/models/UserImage");
const { IMAGE_EXTENSIONS } = require("../../const/registration");

const registrationSaloon = async (req, res) => {
  try {
    const { value, error } = saloonRegistrationSchema.validate(req.body);

    if (error)
      return res.status(400).send("Проверьте правильность введённых данных");

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
    const ServiceSexPriceMapModel = await ServiceSexPriceMap(connection);
    const SexModel = await Sex(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserImageModel = await UserImage(connection);

    const suspectPicture = picturesForm.pictures.find(
      ({ data, fileName, fileType }) =>
        data.indexOf(",") === -1 ||
        fileType.indexOf("image/") !== 0 ||
        fileName.indexOf(".") < 1 ||
        !IMAGE_EXTENSIONS.includes(fileName.split(".")[1])
    );

    if (suspectPicture)
      return res.status(400).send("Неверный формат/размер изображения.");

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

    if (!!existsUsers.length)
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );

    const addedUser = await UserModel.create({
      name: aboutForm.name,
      email: emailForm.email,
      phone: aboutForm.phone,
      password: generateHash(passwordForm.password),
    });

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

    const { dataValues: addedUserSaloonType } = await UserTypeMapModel.create({
      idUser: addedUser.id,
      idUserType: saloonType.id,
      idUserStatus: activeUserStatus.id,
      hash: generateHash(`${addedUser.id}-${saloonType.id}`),
      bonusCount: 0,
    });

    const addedSaloonInfo = await SaloonInfoModel.create({
      idCity: adressForm.city,
      idUserTypeMap: addedUserSaloonType.id,
      street: hasAdress ? adressForm.street : "",
      building: hasAdress ? adressForm.building : "",
      stage: hasAdress ? adressForm.stage : "",
      office: hasAdress ? adressForm.office : "",
      visitPayment: visitPaymentForm.payment,
      workingTime: timeForm.timeLine,
      description: aboutForm.description,
      name: aboutForm.saloonName,
    });

    const addedCategoriesToSaloon =
      await SaloonGroupProcedureMapModel.bulkCreate(
        categoriesForm.categories.map((categoryId) => ({
          idProcedureGroup: categoryId,
          idUserTypeMap: addedUserSaloonType.id,
        }))
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
        }
      );

      const addedMasterInfo = await MasterInfoModel.create({
        idCity: adressForm.city,
        idUserTypeMap: addedUserMasterType.id,
        street: hasAdress ? adressForm.street : "",
        building: hasAdress ? adressForm.building : "",
        stage: hasAdress ? adressForm.stage : "",
        office: hasAdress ? adressForm.office : "",
        visitPayment: visitPaymentForm.payment,
        workingTime: timeForm.timeLine,
        description: "",
      });

      const { dataValues: addedSaloonMasterMap } =
        await SaloonMasterMapModel.create({
          idMaster: addedUserMasterType.id,
          idSaloon: addedUserSaloonType.id,
        });

      const addedServices = await ServiceModel.bulkCreate(
        servicesForm.services.map(({ procedureId, time }) => ({
          idSaloonMasterMap: addedSaloonMasterMap.id,
          idProcedure: procedureId,
          description: "",
          time: `${time.hours < 10 ? "0".concat(time.hours) : time.hours}:${
            time.minutes < 10 ? "0".concat(time.minutes) : time.minutes
          }`,
        }))
      );

      const sexes = await SexModel.findAll({ attributes: ["id"] });

      for (const [index, { dataValues: service }] of addedServices.entries()) {
        await ServiceSexPriceMapModel.bulkCreate(
          sexes.map(({ dataValues: sex }) => ({
            idService: service.id,
            idSex: sex.id,
            price: servicesForm.services[index].price,
          }))
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

      await UserImageModel.create({
        idUserTypeMap: addedUserSaloonType.id,
        url: imageName,
        isMain: false,
      });
    }

    res.send(addedUser);
  } catch (e) {
    res.status(500).send();
  }
};

const registrationUser = async (req, res) => {
  try {
    const { value, error } = userRegistrationSchema.validate(req.body);

    if (error)
      return res.status(400).send("Проверьте правильность введённых данных");

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

    if (!!existsUsers.length)
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );

    const addedUser = await UserModel.create({
      name,
      email,
      phone,
      password: generateHash(password),
    });

    const { dataValues: userTypesToBeCreated } = await UserTypeModel.findOne({
      where: {
        name: roles.client.name,
      },
    });

    const { dataValues: activeUserStatus } = await UserStatusModel.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: addedUserClientType } = await UserTypeMapModel.create({
      idUser: addedUser.id,
      idUserType: userTypesToBeCreated.id,
      idUserStatus: activeUserStatus.id,
      hash: generateHash(`${addedUser.id}-${userTypesToBeCreated.id}`),
      bonusCount: 0,
    });

    const addedClientInfo = await ClientInfoModel.create({
      idUserTypeMap: addedUserClientType.id,
      idSex: sex,
      birthday,
      lastName,
      agree,
    });

    res.send(addedUser);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  registrationSaloon,
  registrationUser,
};
