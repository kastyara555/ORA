const { connection } = require("../../db/connection");
const Service = require("../../db/models/Service");
const ServiceInstance = require("../../db/models/ServiceInstance");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const {
  procedureAvailableDatesBySaloonSchema,
} = require("../../schemas/procedureAvailableDatesBySaloonSchema");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");

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
          AND sis.name = '${SERVICE_INSTANCE_STATUSES.empty.name}'`
    );

    res.send(availableDates);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getAvailableDatesForProcedureBySaloon,
};
