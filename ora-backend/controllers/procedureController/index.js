const moment = require("moment");

const { connection } = require("../../db/connection");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const SaloonInfo = require("../../db/models/SaloonInfo");
const Procedure = require("../../db/models/Procedure");
const UserImage = require("../../db/models/UserImage");
const Service = require("../../db/models/Service");
const City = require("../../db/models/City");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");
const {
  procedureSaloonsSchema,
} = require("../../schemas/procedureSaloonsSchema");

const getProcedureDataByCity = async (req, res) => {
  try {
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const SaloonInfoModel = await SaloonInfo(connection);
    const ProcedureModel = await Procedure(connection);
    const UserImageModel = await UserImage(connection);
    const ServiceModel = await Service(connection);
    const CityModel = await City(connection);

    const { value, error } = procedureSaloonsSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { pageNumber, pageSize } = value;

    const existProcedure = await ProcedureModel.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    const existCity = await CityModel.findOne({
      where: { id: req.params.cityId },
    });

    if (!existCity) {
      return res.status(404).send("Города не существует.");
    }

    const thisTimeFormatted = moment().format("YYYY-MM-DD:HH-MM");

    const subQueryAvailableServices = `SELECT smm.idService as availableServiceId
    FROM \`${ServiceMasterMapModel.tableName}\` smm
    JOIN \`${ServiceInstanceModel.tableName}\` si
    ON smm.id = si.idServiceMasterMap
    JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
    ON si.idServiceInstanceStatus = sis.id
    WHERE sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
    AND si.time > '${thisTimeFormatted}'`;

    const subQueryMainImages = `SELECT idUserTypeMap, url
    FROM \`${UserImageModel.tableName}\`
    WHERE isMain = 1`;

    const queryBody = `FROM \`${SaloonInfoModel.tableName}\` si
    JOIN \`${ServiceModel.tableName}\` s
    ON s.idSaloon = si.idUserTypeMap
    JOIN (${subQueryAvailableServices}) available
    ON s.id = available.availableServiceId
    LEFT JOIN (${subQueryMainImages}) uim
    ON uim.idUserTypeMap = si.idUserTypeMap
    WHERE s.idProcedure = ${existProcedure.dataValues.id}
    AND si.idCity = ${existCity.dataValues.id}`;

    const [[{ total }]] = await connection.query(
      `SELECT COUNT(DISTINCT si.id) as total
      ${queryBody}`
    );

    const offset = pageSize * (pageNumber - 1);

    const [saloonsData] =
      total === 0 || offset >= total
        ? [[]]
        : await connection.query(
            `SELECT DISTINCT si.id as id, si.name as name, si.description as description, uim.url as mainImage
      ${queryBody}
      LIMIT ${pageSize}
      OFFSET ${offset}`
          );

    res.send({
      cityName: existCity.dataValues.name,
      procedureName: existProcedure.dataValues.name,
      saloons: { data: saloonsData, total },
    });
  } catch (e) {
    res.status(500).send();
  }
};

const getProcedureCities = async (req, res) => {
  try {
    const SaloonInfoModel = await SaloonInfo(connection);
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);
    const CityModel = await City(connection);

    const existProcedure = await ProcedureModel.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    const [cities] = await connection.query(
      `SELECT DISTINCT c.id as id, c.name as name
      FROM \`${ServiceModel.tableName}\` s
      JOIN \`${SaloonInfoModel.tableName}\` si
      ON s.idSaloon = si.idUserTypeMap
      JOIN \`${CityModel.tableName}\` c
      ON si.idCity = c.id
      WHERE s.idProcedure = ${req.params.procedureId}`
    );

    res.send({ name: existProcedure.dataValues.name, cities });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getProcedureDataByCity,
  getProcedureCities,
};
