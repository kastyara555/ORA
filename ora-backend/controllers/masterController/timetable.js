const moment = require("moment");

const { connection } = require("../../db/connection");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");

const timetableInformation = async (req, res) => {
  try {
    const {
      service_master_map_status,
      service_instance_status,
      saloon_master_map_status,
      service_master_map,
      saloon_master_map,
      service_instance,
      saloon_info,
      user_image,
      procedure,
      service,
    } = connection.models;

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

    const { dataValues: activeServiceMasterMapStatus } = await service_master_map_status.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const existsServices = await service_master_map.findOne({
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
      FROM \`${saloon_master_map.tableName}\` smm
      JOIN \`${saloon_info.tableName}\` si
      ON smm.idSaloon = si.idUserTypeMap
      JOIN \`${saloon_master_map_status.tableName}\` smms
      ON smm.idSaloonMasterMapStatus = smms.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${user_image.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = smm.idSaloon
      WHERE smm.idMaster = ${req.params.userTypeMapId}
      AND smms.name = '${SALOON_MASTER_MAP_STATUSES.active.name}'`
    );

    const [tmpTimetable] = await connection.query(
      `SELECT si.id as id, p.name as name, si.time as time, s.idSaloon as saloonId, sis.name as statusName
      FROM \`${service_instance.tableName}\` si
      JOIN \`${service_master_map.tableName}\` smm
      ON si.idServiceMasterMap = smm.id
      JOIN \`${service_master_map_status.tableName}\` smms
      ON smm.idServiceMasterMapStatus = smms.id
      JOIN \`${service.tableName}\` s
      ON smm.idService = s.id
      JOIN \`${procedure.tableName}\` p
      ON s.idProcedure = p.id
      JOIN \`${service_instance_status.tableName}\` sis
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
