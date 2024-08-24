const moment = require("moment");

const { connection } = require("../../db/connection");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const {
  procedureSaloonsSchema,
} = require("../../schemas/procedureSaloonsSchema");

const getProcedureDataByCity = async (req, res) => {
  try {
    const {
      service_master_map_status,
      service_instance_status,
      service_master_map,
      service_instance,
      saloon_info,
      user_image,
      procedure,
      service,
      city,
    } = connection.models;

    const { value, error } = procedureSaloonsSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { pageNumber, pageSize } = value;

    const existProcedure = await procedure.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    const existCity = await city.findOne({
      where: { id: req.params.cityId },
    });

    if (!existCity) {
      return res.status(404).send("Города не существует.");
    }

    const thisTimeFormatted = moment().format("YYYY-MM-DD:HH-mm");

    const subQueryAvailableServices = `SELECT smm.idService as availableServiceId
    FROM \`${service_master_map.tableName}\` smm
    JOIN \`${service_master_map_status.tableName}\` smms
    ON smm.idServiceMasterMapStatus = smms.id
    JOIN \`${service_instance.tableName}\` si
    ON smm.id = si.idServiceMasterMap
    JOIN \`${service_instance_status.tableName}\` sis
    ON si.idServiceInstanceStatus = sis.id
    WHERE sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
    AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'
    AND si.time > '${thisTimeFormatted}'`;

    const subQueryMainImages = `SELECT idUserTypeMap, url
    FROM \`${user_image.tableName}\`
    WHERE isMain = 1`;

    const queryBody = `FROM \`${saloon_info.tableName}\` si
    JOIN \`${service.tableName}\` s
    ON s.idSaloon = si.idUserTypeMap
    JOIN (${subQueryAvailableServices}) available
    ON s.id = available.availableServiceId
    LEFT JOIN (${subQueryMainImages}) uim
    ON uim.idUserTypeMap = si.idUserTypeMap
    WHERE s.idProcedure = ${existProcedure.dataValues.id}
    AND si.idCity = ${existCity.dataValues.id}`;

    const [[{ total }]] = await connection.query(
      `SELECT COUNT(DISTINCT si.idUserTypeMap) as total
      ${queryBody}`
    );

    const offset = pageSize * (pageNumber - 1);

    const [saloonsData] =
      total === 0 || offset >= total
        ? [[]]
        : await connection.query(
          `SELECT DISTINCT si.idUserTypeMap as id, si.name as name, si.description as description, uim.url as mainImage, s.id as idService
      ${queryBody}
      LIMIT ${pageSize}
      OFFSET ${offset}`
        );

    return res.send({
      cityName: existCity.dataValues.name,
      procedureName: existProcedure.dataValues.name,
      saloons: { data: saloonsData, total },
    });
  } catch (e) {
    res.status(500).send();
  }
};

// TODO: обдумать. Стоит ли добавлять фильтр по наличию сервис инстансов
const getProcedureCities = async (req, res) => {
  try {
    const {
      procedure,
      city,
      service,
      saloon_info,
    } = connection.models;

    const existProcedure = await procedure.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    const [cities] = await connection.query(
      `SELECT DISTINCT c.id as id, c.name as name
      FROM \`${city.tableName}\` c
      JOIN \`${saloon_info.tableName}\` si
      ON si.idCity = c.id
      JOIN \`${service.tableName}\` s
      ON s.idSaloon = si.idUserTypeMap
      WHERE s.idProcedure = ${req.params.procedureId}`
    );

    return res.send({ name: existProcedure.dataValues.name, cities });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getProcedureDataByCity,
  getProcedureCities,
};
