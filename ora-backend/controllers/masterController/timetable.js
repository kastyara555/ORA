const { Op } = require("sequelize");
const moment = require("moment");

const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const SaloonInfo = require("../../db/models/SaloonInfo");
const UserImage = require("../../db/models/UserImage");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const { connection } = require("../../db/connection");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");

const timetableAvailability = async (req, res) => {
  try {
    const ServiceMasterMapModel = await ServiceMasterMap(connection);

    const existsServices = await ServiceMasterMapModel.findOne({
      where: { idMaster: req.params.userTypeMapId },
    });

    return res.send({
      isTimetableAvailable: !!existsServices,
    });
  } catch (e) {
    res.status(500).send();
  }
};

const timetableInformation = async (req, res) => {
  try {
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const SaloonInfoModel = await SaloonInfo(connection);
    const UserImageModel = await UserImage(connection);
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);

    if (req.params.date.length !== 10) {
      return res.status(400).send("Неверный формат даты.");
    }

    const date = moment(req.params.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    if (!date.isSameOrAfter(moment(), "day")) {
      return res
        .status(400)
        .send("Получить расписание можно только для сегодня и будущих дней.");
    }

    const existsServices = await ServiceMasterMapModel.findOne({
      where: { idMaster: req.params.userTypeMapId },
    });

    if (!existsServices) {
      res.send(null);
    }

    const [saloonsTmp] = await connection.query(
      `SELECT smm.idSaloon as id, si.name as name
      FROM \`${SaloonMasterMapModel.tableName}\` smm
      JOIN \`${SaloonInfoModel.tableName}\` si
      ON smm.idSaloon = si.idUserTypeMap
      WHERE smm.idMaster = ${req.params.userTypeMapId}`
    );

    const saloonsIds = saloonsTmp.map(({ id }) => id);

    const saloonsImages = saloonsIds.length
      ? await UserImageModel.findAll({
          where: { idUserTypeMap: { [Op.in]: saloonsIds }, isMain: 1 },
          attributes: ["idUserTypeMap", "url"],
        })
      : [];

    const saloonsImagesMap = saloonsImages.reduce(
      (accum, { dataValues: { idUserTypeMap, url } }) => ({
        ...accum,
        [idUserTypeMap]: url,
      }),
      {}
    );

    const saloons = saloonsTmp.map(({ id, name }) => ({
      name,
      id,
      mainImage: saloonsImagesMap[id] ?? null,
    }));

    const [tmpTimetable] = await connection.query(
      `SELECT si.id as id, p.name as name, si.time as time, s.idSaloon as saloonId, sis.name as statusName
      FROM \`${ServiceInstanceModel.tableName}\` si
      JOIN \`${ServiceMasterMapModel.tableName}\` smm
      ON si.idServiceMasterMap = smm.id
      JOIN \`${ServiceModel.tableName}\` s
      ON smm.idService = s.id
      JOIN \`${ProcedureModel.tableName}\` p
      ON s.idProcedure = p.id
      JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
      ON si.idServiceInstanceStatus = sis.id
      WHERE smm.idMaster = ${req.params.userTypeMapId}
      AND si.time LIKE '${date.format("YYYY-MM-DD")}%'
      AND sis.name != '${SERVICE_INSTANCE_STATUSES.removed.name}'
      ORDER BY si.time`
    );

    const saloonsMap = saloons.reduce(
      (accum, saloon) => ({
        ...accum,
        [saloon.id]: saloon,
      }),
      {}
    );

    const timetable = tmpTimetable.map(({ saloonId, ...record }) => ({
      ...record,
      time: record.time.split(":")[1].replace("-", ":"),
      saloon: saloonsMap[saloonId],
    }));

    return res.send({
      saloons,
      timetable,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

module.exports = { timetableAvailability, timetableInformation };
