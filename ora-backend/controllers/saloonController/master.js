const { Op } = require("sequelize");
const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const MasterInfo = require("../../db/models/MasterInfo");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const User = require("../../db/models/User");
const UserImage = require("../../db/models/UserImage");
const UserType = require("../../db/models/UserType");
const UserTypeMap = require("../../db/models/UserTypeMap");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const Service = require("../../db/models/Service");
const {
  saloonDeleteMastersSchema,
} = require("../../schemas/saloonDeleteMastersSchema");
const {
  saloonAddMasterSchema,
} = require("../../schemas/saloonAddMasterSchema");

const getSaloonMasters = async (req, res) => {
  try {
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserTypeModel = await UserType(connection);
    const UserModel = await User(connection);
    const UserImageModel = await UserImage(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);

    const { dataValues: saloonUserType } = await UserTypeModel.findOne({
      where: {
        name: roles.saloon.name,
      },
    });

    const saloonMapInfo = await UserTypeMapModel.findOne({
      where: { id: req.params.userTypeMapId, idUserType: saloonUserType.id },
    });

    if (!saloonMapInfo) {
      return res.status(400).send("Пользователь не найден.");
    }

    const masters = await SaloonMasterMapModel.findAll({
      where: { idSaloon: req.params.userTypeMapId },
    });

    if (!masters.length) {
      res.send([]);
    }

    const mastersIds = masters.map(({ dataValues }) => dataValues.idMaster);

    const [mastersData] = await connection.query(
      `SELECT utm.id code, u.name name, u.email as email, u.phone as phone
    FROM \`${MasterInfoModel.tableName}\` m
    JOIN \`${UserTypeMapModel.tableName}\` utm
    ON utm.id = m.idUserTypeMap
    JOIN \`${UserModel.tableName}\` u
    ON u.id = utm.idUser
    WHERE m.idUserTypeMap IN (${mastersIds.join(", ")})`
    );

    const mainImages = await UserImageModel.findAll({
      where: {
        idUserTypeMap: {
          [Op.in]: mastersIds,
        },
        isMain: true,
      },
    });

    const mappedImages = mainImages
      .map(({ dataValues }) => dataValues)
      .reduce(
        (accum, { idUserTypeMap, url }) => ({ ...accum, [idUserTypeMap]: url }),
        {}
      );

    const result = mastersData.map((master) => ({
      ...master,
      mainImage: mappedImages[master.code] || null,
    }));

    return res.send(result);
  } catch (e) {
    res.status(500).send();
  }
};

const deleteSaloonMasters = async (req, res) => {
  // TODO: пересмотреть удаление после завершения первой итерации разработки
  try {
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserTypeModel = await UserType(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const ServiceModel = await Service(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);

    const { dataValues: saloonUserType } = await UserTypeModel.findOne({
      where: {
        name: roles.saloon.name,
      },
    });

    const saloonMapInfo = await UserTypeMapModel.findOne({
      where: { id: req.params.userTypeMapId, idUserType: saloonUserType.id },
    });

    if (!saloonMapInfo) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { value, error } = saloonDeleteMastersSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { codes } = value;

    const saloonMasterMapInstances = await SaloonMasterMapModel.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
        idMaster: {
          [Op.in]: codes,
        },
      },
    });

    await SaloonMasterMapModel.destroy({
      where: {
        id: {
          [Op.in]: saloonMasterMapInstances.map(
            ({ dataValues }) => dataValues.id
          ),
        },
      },
    });

    const servicesToBeUnlinked = await ServiceModel.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
      },
    });

    if (servicesToBeUnlinked.length) {
      await ServiceMasterMapModel.destroy({
        where: {
          idMaster: {
            [Op.in]: codes,
          },
          idService: {
            [Op.in]: servicesToBeUnlinked.map(
              ({ dataValues }) => dataValues.id
            ),
          },
        },
      });
    }

    return await getSaloonMasters(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const addSaloonMaster = async (req, res) => {
  try {
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserTypeModel = await UserType(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);

    const { dataValues: saloonUserType } = await UserTypeModel.findOne({
      where: {
        name: roles.saloon.name,
      },
    });

    const saloonMapInfo = await UserTypeMapModel.findOne({
      where: { id: req.params.userTypeMapId, idUserType: saloonUserType.id },
    });

    if (!saloonMapInfo) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { value, error } = saloonAddMasterSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { code } = value;

    const { dataValues: masterUserType } = await UserTypeModel.findOne({
      where: {
        name: roles.master.name,
      },
    });

    const masterRecordInMap = await UserTypeMapModel.findOne({
      where: {
        id: code,
        idUserType: masterUserType.id,
      },
    });

    if (!masterRecordInMap) {
      return res.status(400).send("Мастер не найден");
    }

    const masterRecordInSaloon = await SaloonMasterMapModel.findOne({
      where: {
        idSaloon: req.params.userTypeMapId,
        idMaster: code,
      },
    });

    if (masterRecordInSaloon) {
      return res.status(400).send("Мастер уже добавлен в Ваш салон");
    }

    const newRecord = await SaloonMasterMapModel.create({
      idSaloon: req.params.userTypeMapId,
      idMaster: code,
    });

    res.send({});
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getSaloonMasters, deleteSaloonMasters, addSaloonMaster };
