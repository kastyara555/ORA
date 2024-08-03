const moment = require("moment");

const ServiceMasterMapStatus = require("../../db/models/ServiceMasterMapStatus");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const SaloonMasterMapStatus = require("../../db/models/SaloonMasterMapStatus");
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
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");

const timetableInformation = async (req, res) => {
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
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

    const { dataValues: activeServiceMasterMapStatus } = await ServiceMasterMapStatusModel.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const existsServices = await ServiceMasterMapModel.findOne({
      where: { 
        idMaster: req.params.userTypeMapId,
        idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
      },
    });

    if (!existsServices) {
      return res.send(null);
    }

    const [saloons] = await connection.query(
      `SELECT smm.idSaloon as id, si.name as name, uim.url as mainImage
      FROM \`${SaloonMasterMapModel.tableName}\` smm
      JOIN \`${SaloonInfoModel.tableName}\` si
      ON smm.idSaloon = si.idUserTypeMap
      JOIN \`${SaloonMasterMapStatusModel.tableName}\` smms
      ON smm.idSaloonMasterMapStatus = smms.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${UserImageModel.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = smm.idSaloon
      WHERE smm.idMaster = ${req.params.userTypeMapId}
      AND smms.name = '${SALOON_MASTER_MAP_STATUSES.active.name}'`
    );

    const [tmpTimetable] = await connection.query(
      `SELECT si.id as id, p.name as name, si.time as time, s.idSaloon as saloonId, sis.name as statusName
      FROM \`${ServiceInstanceModel.tableName}\` si
      JOIN \`${ServiceMasterMapModel.tableName}\` smm
      ON si.idServiceMasterMap = smm.id
      JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
      ON smm.idServiceMasterMapStatus = smms.id
      JOIN \`${ServiceModel.tableName}\` s
      ON smm.idService = s.id
      JOIN \`${ProcedureModel.tableName}\` p
      ON s.idProcedure = p.id
      JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
      ON si.idServiceInstanceStatus = sis.id
      WHERE smm.idMaster = ${req.params.userTypeMapId}
      AND si.time LIKE '${date.format("YYYY-MM-DD")}%'
      AND sis.name != '${SERVICE_INSTANCE_STATUSES.removed.name}'
      AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'
      ORDER BY si.time`
    );

    const saloonsMap = saloons.reduce(
      (accum, saloon) => ({
        ...accum,
        [saloon.id]: saloon,
      }),
      {},
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

module.exports = { timetableInformation };
