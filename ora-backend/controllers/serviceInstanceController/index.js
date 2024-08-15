const moment = require("moment");

const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const { userStatuses } = require("../../db/consts/userStatuses");
const User = require("../../db/models/User");
const Service = require("../../db/models/Service");
const UserType = require("../../db/models/UserType");
const UserImage = require("../../db/models/UserImage");
const UserStatus = require("../../db/models/UserStatus");
const UserTypeMap = require("../../db/models/UserTypeMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const ServiceMasterMapStatus = require("../../db/models/ServiceMasterMapStatus");
const {
  procedureAvailableDatesBySaloonSchema,
} = require("../../schemas/procedureAvailableDatesBySaloonSchema");
const {
  procedureAvailableMastersBySaloonAndDateSchema,
} = require("../../schemas/procedureAvailableMastersBySaloonAndDateSchema");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const {
  procedureAvailableRecordsBySaloonDateAndMasterSchema,
} = require("../../schemas/procedureAvailableRecordsBySaloonDateAndMasterSchema");
const { bookServiceInstanceSchema } = require("../../schemas/bookServiceInstanceSchema");
const { loginBookServiceInstanceSchema } = require("../../schemas/loginBookServiceInstanceSchema");
const { generateHash } = require("../../utils/hash");
const { createToken } = require("../../utils/jwt");

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
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);

    const { year, month } = value;
    const formatedMonth = month < 10 ? `0${month}` : month.toString();

    const [availableDates] = await connection.query(
      `SELECT DISTINCT SUBSTRING(si.time, 1, 10) as date
      FROM \`${ServiceInstanceModel.tableName}\` si
      JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
      ON si.idServiceInstanceStatus = sis.id
      JOIN \`${ServiceMasterMapModel.tableName}\` smm
      ON si.idServiceMasterMap = smm.id
      JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
      ON smm.idServiceMasterMapStatus = smms.id
      JOIN \`${ServiceModel.tableName}\` s
      ON smm.idService = s.id
      WHERE s.idSaloon = ${req.params.saloonId}
      AND s.idProcedure = ${req.params.procedureId}
      AND si.time LIKE '${year}-${formatedMonth}-%'
      AND si.time > '${moment().add(2, "hours").format("YYYY-MM-DD:HH-mm")}'
      AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
      AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'
      ORDER BY date ASC`
    );

    return res.send(availableDates.map(({ date }) => date));
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
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);

    const [availableMasters] = await connection.query(
      `SELECT DISTINCT utm.id as id, u.name as name, uim.url as mainImage, smm.price as price
          FROM \`${ServiceInstanceModel.tableName}\` si
          JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          JOIN \`${ServiceMasterMapModel.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
          ON smm.idServiceMasterMapStatus = smms.id
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
          AND si.time > '${moment().add(2, "hours").format("YYYY-MM-DD:HH-mm")}'
          AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
          AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'
          ORDER BY name`
    );

    return res.send(availableMasters);
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
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);

    const [availableRecords] = await connection.query(
      `SELECT si.id as id, SUBSTRING(si.time, 12, 5) as time
          FROM \`${ServiceInstanceModel.tableName}\` si
          JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          JOIN \`${ServiceMasterMapModel.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
          ON smm.idServiceMasterMapStatus = smms.id
          JOIN \`${ServiceModel.tableName}\` s
          ON smm.idService = s.id
          JOIN \`${UserTypeMapModel.tableName}\` utm
          ON smm.idMaster = utm.id
          WHERE s.idSaloon = ${req.params.saloonId}
          AND s.idProcedure = ${req.params.procedureId}
          AND si.time LIKE '${date.format("YYYY-MM-DD")}:%'
          AND si.time > '${moment().add(2, "hours").format("YYYY-MM-DD:HH-mm")}'
          AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'
          AND utm.id = ${value.masterId}
          AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'
          ORDER BY time`
    );

    return res.send(
      availableRecords.map((record) => ({
        ...record,
        time: record.time.replace("-", ":"),
      }))
    );
  } catch (e) {
    res.status(500).send();
  }
};

const bookServiceInstance = async (
  req,
  res
) => {
  try {
    const { value, error } = bookServiceInstanceSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { serviceInstanceId, clientUserTypeMapId, comment } = value;

    const UserTypeModel = await UserType(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

    const [clientsInfo] = await connection.query(
      `SELECT *
      FROM \`${UserTypeMapModel.tableName}\` utm
      JOIN \`${UserTypeModel.tableName}\` ut
      ON utm.idUserType = ut.id
      WHERE utm.id = ${clientUserTypeMapId}
      AND ut.name = '${roles.client.name}'`
    );

    if (!clientsInfo.length) {
      return res.status(400).send("Учётная запись клиента не найдена.")
    }

    const [serviceInstancesInfo] = await connection.query(
      `SELECT sis.name as statusName
      FROM \`${ServiceInstanceModel.tableName}\` si
      JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
      ON si.idServiceInstanceStatus = sis.id
      WHERE si.id = ${serviceInstanceId}`
    );

    if (!serviceInstancesInfo.length) {
      return res.status(400).send("Услуга не найдена.")
    }

    if (serviceInstancesInfo[0].statusName !== SERVICE_INSTANCE_STATUSES.empty.name) {
      return res.status(400).send("Услуга не доступна для записи.")
    }

    const appliedServiceInstanceStatus = await ServiceInstanceStatusModel.findOne({ where: { name: SERVICE_INSTANCE_STATUSES.applied.name } })

    await ServiceInstanceModel.update(
      {
        idServiceInstanceStatus: appliedServiceInstanceStatus.dataValues.id,
        idClient: clientUserTypeMapId,
        comment,
      },
      {
        where: {
          id: serviceInstanceId,
        },
      }
    );

    return res.send({});
  } catch (e) {
    res.status(500).send();
  }
};

const loginBookServiceInstance = async (
  req,
  res
) => {
  try {
    const { value, error } = loginBookServiceInstanceSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { serviceInstanceId, comment, email, password } = value;

    const UserModel = await User(connection);
    const UserTypeModel = await UserType(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

    const [clientsInfo] = await connection.query(
      `SELECT utm.id as id
      FROM \`${UserModel.tableName}\` u
      JOIN \`${UserTypeMapModel.tableName}\` utm
      ON u.id = utm.idUser
      JOIN \`${UserTypeModel.tableName}\` ut
      ON utm.idUserType = ut.id
      JOIN \`${UserStatusModel.tableName}\` us
      ON utm.idUserStatus = us.id
      WHERE u.email = '${email}'
      AND u.password = '${generateHash(password)}'
      AND ut.name = '${roles.client.name}'
      AND us.name = '${userStatuses.active.name}'`
    );

    if (!clientsInfo.length) {
      return res.status(400).send("Учётная запись клиента не найдена.")
    }

    const [serviceInstancesInfo] = await connection.query(
      `SELECT sis.name as statusName
      FROM \`${ServiceInstanceModel.tableName}\` si
      JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
      ON si.idServiceInstanceStatus = sis.id
      WHERE si.id = ${serviceInstanceId}`
    );

    if (!serviceInstancesInfo.length) {
      return res.status(400).send("Услуга не найдена.")
    }

    if (serviceInstancesInfo[0].statusName !== SERVICE_INSTANCE_STATUSES.empty.name) {
      return res.status(400).send("Услуга не доступна для записи.")
    }

    const appliedServiceInstanceStatus = await ServiceInstanceStatusModel.findOne({ where: { name: SERVICE_INSTANCE_STATUSES.applied.name } })

    await ServiceInstanceModel.update(
      {
        idServiceInstanceStatus: appliedServiceInstanceStatus.dataValues.id,
        idClient: clientsInfo[0].id,
        comment,
      },
      {
        where: {
          id: serviceInstanceId,
        },
      }
    );

    return res.send({ token: createToken(clientsInfo[0].id) });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getAvailableDatesForProcedureBySaloon,
  getAvailableMastersForProcedureBySaloonAndDate,
  getAvailableRecordsForProcedureBySaloonDateAndMaster,
  bookServiceInstance,
  loginBookServiceInstance,
};
