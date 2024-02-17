const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const UserType = require("../../db/models/UserType");
const UserTypeMap = require("../../db/models/UserTypeMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const MasterInfo = require("../../db/models/MasterInfo");
const User = require("../../db/models/User");
const UserImage = require("../../db/models/UserImage");

const getSaloonServiceInfo = async (req, res) => {
  try {
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const ProcedureModel = await Procedure(connection);
    const UserImageModel = await UserImage(connection);
    const UserTypeModel = await UserType(connection);
    const ServiceModel = await Service(connection);
    const UserModel = await User(connection);

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

    const serviceBaseInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceBaseInfo) {
      return res.status(400).send("Нет информации об услуге.");
    }

    const procedureBaseInfo = await ProcedureModel.findOne({
      where: { id: serviceBaseInfo.dataValues.idProcedure },
    });

    if (!procedureBaseInfo) {
      return res.status(400).send("Нет информации о процедуре.");
    }

    const saloonMasters = await SaloonMasterMapModel.findAll({
      where: { idSaloon: req.params.userTypeMapId },
    });

    let activeMasters = [];
    let availableMasters = [];

    if (saloonMasters.length) {
      const mastersIds = saloonMasters.map(
        ({ dataValues }) => dataValues.idMaster
      );

      const [mastersData] = await connection.query(
        `SELECT utm.id id, u.name name, u.email as email
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
          (accum, { idUserTypeMap, url }) => ({
            ...accum,
            [idUserTypeMap]: url,
          }),
          {}
        );

      const preparedAllMasters = mastersData.map((master) => ({
        ...master,
        mainImage: mappedImages[master.id] || null,
      }));

      const activeMastersBaseInfo = await ServiceMasterMapModel.findAll({
        where: {
          idService: req.params.serviceId,
          idMaster: {
            [Op.in]: mastersIds,
          },
        },
      });

      const activeMastersBaseInfoMap = activeMastersBaseInfo
        .map(({ dataValues }) => dataValues)
        .reduce(
          (accum, { idMaster, price }) => ({ ...accum, [idMaster]: price }),
          {}
        );

      activeMasters = preparedAllMasters
        .filter(({ id }) => activeMastersBaseInfoMap[id])
        .map((masterInfo) => ({
          ...masterInfo,
          price: activeMastersBaseInfoMap[masterInfo.id],
        }));

      availableMasters = preparedAllMasters.filter(
        ({ id }) => !activeMastersBaseInfoMap[id]
      );
    }

    const result = {
      id: serviceBaseInfo.dataValues.id,
      description: serviceBaseInfo.dataValues.description,
      procedureName: procedureBaseInfo.dataValues.name,
      activeMasters,
      availableMasters,
    };

    return res.send(result);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getSaloonServiceInfo };
