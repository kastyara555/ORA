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
const { roles } = require("../../db/consts/roles");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { generateHash } = require("../../utils/hash");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { sendRegistrationMail } = require("../../email");

const registrationSaloon = async (req, res) => {
  const transaction = await connection.transaction();

  try {
    const { value, error } = saloonRegistrationSchema.validate(req.body);

    if (error) {
      await transaction.rollback();
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
      stuffCountForm,
      servicesForm,
      picturesForm,
    } = value;

    const {
      service_master_map_status,
      saloon_master_map_status,
      service_master_map,
      saloon_master_map,
      user_type_map,
      saloon_info,
      master_info,
      user_status,
      user_image,
      user_type,
      service,
      user,
    } = connection.models;

    const suspectPicture =
      !!picturesForm.mainImage &&
      (
        picturesForm.mainImage.data.indexOf(",") === -1 ||
        picturesForm.mainImage.fileType.indexOf("image/") !== 0 ||
        picturesForm.mainImage.fileName.indexOf(".") < 1 ||
        !IMAGE_EXTENSIONS.includes(picturesForm.mainImage.fileName.split(".")[1].toLowerCase())
      );

    if (suspectPicture) {
      await transaction.rollback();
      return res.status(400).send("Неверный формат/размер изображения.");
    }

    const existsUsers = await user.findOne({
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

    if (existsUsers) {
      await transaction.rollback();
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );
    }

    const addedUser = await user.create(
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

    const { dataValues: activeUserStatus } = await user_status.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: saloonType } = await user_type.findOne({
      where: {
        name: roles.saloon.name,
      },
    });

    const { dataValues: addedUserSaloonType } = await user_type_map.create(
      {
        idUser: addedUser.id,
        idUserType: saloonType.id,
        idUserStatus: activeUserStatus.id,
        hash: generateHash(`${addedUser.id}-${saloonType.id}`),
        bonusCount: 0,
      },
      { transaction }
    );

    await saloon_info.create(
      {
        idCity: adressForm.city,
        idStreetType: hasAdress ? adressForm.streetType : null,
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

    if (isSelfEmployed) {
      const { dataValues: masterType } = await user_type.findOne({
        where: {
          name: roles.master.name,
        },
      });

      const { dataValues: addedUserMasterType } = await user_type_map.create(
        {
          idUser: addedUser.id,
          idUserType: masterType.id,
          idUserStatus: activeUserStatus.id,
          hash: generateHash(`${addedUser.id}-${masterType.id}`),
          bonusCount: 0,
        },
        { transaction }
      );

      await master_info.create(
        {
          idUserTypeMap: addedUserMasterType.id,
          description: "",
        },
        { transaction }
      );

      const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne({
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name,
        },
      });

      await saloon_master_map.create(
        {
          idMaster: addedUserMasterType.id,
          idSaloon: addedUserSaloonType.id,
          idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
        },
        { transaction }
      );
    }

    if (picturesForm.mainImage) {
      const dirName = "/userUploads/" + addedUserSaloonType.id + "/images/";
      const fullDirName = "public" + dirName;
      const imageName = dirName + picturesForm.mainImage.fileName;
      const fullImageName = "public" + imageName;

      if (!fs.existsSync(fullDirName)) {
        fs.mkdirSync(fullDirName, { recursive: true });
      }

      let buff = new Buffer.from(picturesForm.mainImage.data.split(",")[1], "base64");
      fs.writeFileSync(fullImageName, buff);

      await user_image.create(
        {
          idUserTypeMap: addedUserSaloonType.id,
          url: imageName,
          isMain: true,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // TODO: Наблюдать, как данный код будет вести себя без транзакций
    if (isSelfEmployed && servicesForm.services.length) {
      const { dataValues: masterType } = await user_type.findOne({
        where: {
          name: roles.master.name,
        },
      });

      const { dataValues: addedUserMasterType } = await user_type_map.findOne({
        where:
        {
          idUser: addedUser.id,
          idUserType: masterType.id,
        }
      });

      // TODO: здесь баг, тк транзакция не закоммичена
      const addedServices = await service.bulkCreate(
        servicesForm.services.map(({ procedureId, time }) => ({
          idSaloon: addedUserSaloonType.id,
          idProcedure: procedureId,
          description: "",
          time: `${time.hours < 10 ? "0".concat(time.hours) : time.hours}:${time.minutes < 10 ? "0".concat(time.minutes) : time.minutes
            }`,
        })),
        { returning: true },
      );

      const { dataValues: activeServiceMasterMapStatus } = await service_master_map_status.findOne({
        where: {
          name: SERVICES_MASTER_MAP_STATUSES.active.name,
        },
      });

      await service_master_map.bulkCreate(
        addedServices.map(({ dataValues }, index) => ({
          idService: dataValues.id,
          idMaster: addedUserMasterType.id,
          price: servicesForm.services[index].price,
          idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
        })),
      );
    }

    return res.send(addedUser);
  } catch (e) {
    await transaction.rollback();
    res.status(500).send("Что-то пошло не так");
  }
};

const registrationUser = async (req, res) => {
  const transaction = await connection.transaction();

  try {
    const { value, error } = userRegistrationSchema.validate(req.body);

    if (error) {
      await transaction.rollback();
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { email, phone, name, lastName, password, birthday, sex, agree } =
      value;

    const {
      user_type_map,
      client_info,
      user_status,
      user_type,
      user,
    } = connection.models;

    const existsUsers = await user.findAll({
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
      await transaction.rollback();
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );
    }

    const addedUser = await user.create(
      {
        name,
        email,
        phone,
        password: generateHash(password),
      },
      { transaction }
    );

    const { dataValues: userTypesToBeCreated } = await user_type.findOne({
      where: {
        name: roles.client.name,
      },
    });

    const { dataValues: activeUserStatus } = await user_status.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: addedUserClientType } = await user_type_map.create(
      {
        idUser: addedUser.id,
        idUserType: userTypesToBeCreated.id,
        idUserStatus: activeUserStatus.id,
        hash: generateHash(`${addedUser.id}-${userTypesToBeCreated.id}`),
        bonusCount: 0,
      },
      { transaction }
    );

    await client_info.create(
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
    return res.send(addedUser);
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
      await transaction.rollback();
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { name, email, phone, password, description, relatedSaloonMapId } =
      value;

    const {
      saloon_master_map_status,
      saloon_master_map,
      user_type_map,
      master_info,
      user_status,
      user_type,
      user,
    } = connection.models;

    const existsUsers = await user.findAll({
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
      await transaction.rollback();
      return res
        .status(400)
        .send(
          "Пользователь с данной почтой или телефоном уже зарегистрирован."
        );
    }

    if (relatedSaloonMapId) {
      const { dataValues: saloonUserTypeData } = await user_type.findOne({
        where: {
          name: roles.saloon.name,
        },
      });

      const saloonToBeRelated = await user_type_map.findOne({
        where: {
          id: relatedSaloonMapId,
          idUserType: saloonUserTypeData.id,
        },
      });

      if (!saloonToBeRelated) {
        await transaction.rollback();
        return res
          .status(400)
          .send("Салон, на который ссылается форма не существует.");
      }
    }

    const addedUser = await user.create(
      {
        name,
        email,
        phone,
        password: generateHash(password),
      },
      { transaction }
    );

    const { dataValues: userTypesToBeCreated } = await user_type.findOne({
      where: {
        name: roles.master.name,
      },
    });

    const { dataValues: activeUserStatus } = await user_status.findOne({
      where: { name: userStatuses.active.name },
    });

    const { dataValues: addedMasterType } = await user_type_map.create(
      {
        idUser: addedUser.id,
        idUserType: userTypesToBeCreated.id,
        idUserStatus: activeUserStatus.id,
        hash: generateHash(`${addedUser.id}-${userTypesToBeCreated.id}`),
        bonusCount: 0,
      },
      { transaction }
    );

    await master_info.create(
      {
        idUserTypeMap: addedMasterType.id,
        description,
      },
      { transaction }
    );

    if (relatedSaloonMapId) {
      const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne({
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name,
        },
      });

      await saloon_master_map.create(
        {
          idMaster: addedMasterType.id,
          idSaloon: relatedSaloonMapId,
          idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
        },
        { transaction }
      );
    }

    sendRegistrationMail({
      to: email,
      username: name,
    });

    await transaction.commit();
    return res.send(addedUser);
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

    const existsUsers = await connection.models.user.findAll({
      where: {
        [Sequelize.Op.or]: userConditions,
      },
    });

    return res.send({ available: !existsUsers.length });
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
