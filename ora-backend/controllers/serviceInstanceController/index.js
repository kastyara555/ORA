const moment = require("moment");

const { connection } = require("../../db/connection");
const Service = require("../../db/models/Service");
const UserImage = require("../../db/models/UserImage");
const ServiceInstance = require("../../db/models/ServiceInstance");
const UserTypeMap = require("../../db/models/UserTypeMap");
const User = require("../../db/models/User");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const {
  procedureAvailableDatesBySaloonSchema,
} = require("../../schemas/procedureAvailableDatesBySaloonSchema");
const {
  procedureAvailableMastersBySaloonAndDateSchema,
} = require("../../schemas/procedureAvailableMastersBySaloonAndDateSchema");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");
const {
  procedureAvailableRecordsBySaloonDateAndMasterSchema,
} = require("../../schemas/procedureAvailableRecordsBySaloonDateAndMasterSchema");

const getAvailableDatesForProcedureBySaloon = async (req, res) => {
  try {
    const { value, error } = procedureAvailableDatesBySaloonSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const ServiceModel = await Service(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

    const { year, month } = value;
    const formatedMonth = month < 10 ? `0${month}` : month.toString();

    const [availableDates] = await connection.query(
      `SELECT DISTINCT SUBSTRING(si.time, 1, 10) as date
          FROM \`${ServiceInstanceModel.tableName}\` si
          JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          JOIN \`${ServiceMasterMapModel.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${ServiceModel.tableName}\` s
          ON smm.idService = s.id
          WHERE s.idSaloon = ${req.params.saloonId}
          AND s.idProcedure = ${req.params.procedureId}
          AND si.time LIKE '${year}-${formatedMonth}-%'
          AND si.time > '${moment().add(2, "hours").format("YYYY-MM-DD:HH-MM")}'
          AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
          ORDER BY date ASC`
    );

    res.send(availableDates.map(({ date }) => date));
  } catch (e) {
    res.status(500).send();
  }
};

const getAvailableMastersForProcedureBySaloonAndDate = async (req, res) => {
  try {
    const { value, error } =
      procedureAvailableMastersBySaloonAndDateSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const date = moment(value.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    const UserModel = await User(connection);
    const ServiceModel = await Service(connection);
    const UserImageModel = await UserImage(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

    const [availableMasters] = await connection.query(
      `SELECT DISTINCT utm.id as id, u.name as name, uim.url as mainImage
          FROM \`${ServiceInstanceModel.tableName}\` si
          JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          JOIN \`${ServiceMasterMapModel.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${ServiceModel.tableName}\` s
          ON smm.idService = s.id
          JOIN \`${UserTypeMapModel.tableName}\` utm
          ON smm.idMaster = utm.id
          JOIN \`${UserModel.tableName}\` u
          ON utm.idUser = u.id
          LEFT JOIN (
            SELECT idUserTypeMap, url
            FROM \`${UserImageModel.tableName}\`
            WHERE isMain = 1
          ) uim
          ON uim.idUserTypeMap = utm.id
          WHERE s.idSaloon = ${req.params.saloonId}
          AND s.idProcedure = ${req.params.procedureId}
          AND si.time LIKE '${date.format("YYYY-MM-DD")}:%'
          AND si.time > '${moment().add(2, "hours").format("YYYY-MM-DD:HH-MM")}'
          AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
          ORDER BY name`
    );

    res.send(availableMasters);
  } catch (e) {
    res.status(500).send();
  }
};

const getAvailableRecordsForProcedureBySaloonDateAndMaster = async (
  req,
  res
) => {
  try {
    const { value, error } =
      procedureAvailableRecordsBySaloonDateAndMasterSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const date = moment(value.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    const ServiceModel = await Service(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

    const [availableRecords] = await connection.query(
      `SELECT si.id as id, SUBSTRING(si.time, 12, 5) as time
          FROM \`${ServiceInstanceModel.tableName}\` si
          JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          JOIN \`${ServiceMasterMapModel.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${ServiceModel.tableName}\` s
          ON smm.idService = s.id
          JOIN \`${UserTypeMapModel.tableName}\` utm
          ON smm.idMaster = utm.id
          WHERE s.idSaloon = ${req.params.saloonId}
          AND s.idProcedure = ${req.params.procedureId}
          AND si.time LIKE '${date.format("YYYY-MM-DD")}:%'
          AND si.time > '${moment().add(2, "hours").format("YYYY-MM-DD:HH-MM")}'
          AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
          AND utm.id = ${value.masterId}
          ORDER BY time`
    );

    res.send(
      availableRecords.map((record) => ({
        ...record,
        time: record.time.replace("-", ":"),
      }))
    );
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getAvailableDatesForProcedureBySaloon,
  getAvailableMastersForProcedureBySaloonAndDate,
  getAvailableRecordsForProcedureBySaloonDateAndMaster,
};
