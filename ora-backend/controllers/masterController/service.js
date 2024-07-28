const moment = require("moment");

const ServiceMasterMapStatus = require("../../db/models/ServiceMasterMapStatus");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const SaloonMasterMapStatus = require("../../db/models/SaloonMasterMapStatus");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const SaloonInfo = require("../../db/models/SaloonInfo");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const { connection } = require("../../db/connection");
const {
  masterCreateServiceInstanceSchema,
} = require("../../schemas/masterCreateServiceInstanceSchema");
const {
  SERVICE_INSTANCE_STATUSES,
} = require("../../db/consts/serviceInstanceStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { timetableInformation } = require("./timetable");

const getServicesBySaloon = async (req, res) => {
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);

    const { dataValues: activeSaloonMasterMapStatus } = await SaloonMasterMapStatusModel.findOne({
      where: {
        name: SALOON_MASTER_MAP_STATUSES.active.name,
      },
    });

    const existsSaloonMasterMap = await SaloonMasterMapModel.findOne({
      where: {
        idMaster: req.params.userTypeMapId,
        idSaloon: req.params.idSaloon,
        idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
      },
    });

    if (!existsSaloonMasterMap) {
      return res.status(400).send("Мастер не относится к салону");
    }

    const [services] = await connection.query(
      `SELECT smm.id as id, p.name as name
      FROM \`${ServiceModel.tableName}\` s
      JOIN \`${ServiceMasterMapModel.tableName}\` smm
      ON s.id = smm.idService
      JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
      ON smm.idServiceMasterMapStatus = smms.id
      JOIN \`${ProcedureModel.tableName}\` p
      ON s.idProcedure = p.id
      WHERE smm.idMaster = ${req.params.userTypeMapId}
      AND s.idSaloon = ${req.params.idSaloon}
      AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'`
    );

    return res.send({ services });
  } catch (e) {
    res.status(500).send();
  }
};

const createServiceInstance = async (req, res) => {
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceModel = await Service(connection);
    const SaloonInfoModel = await SaloonInfo(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

    const { value, error } = masterCreateServiceInstanceSchema.validate(
      req.body
    );

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { dataValues: activeServiceMasterMapStatus } = await ServiceMasterMapStatusModel.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const existsServiceMasterMap = await ServiceMasterMapModel.findOne({
      where: {
        id: value.id,
        idMaster: req.params.userTypeMapId,
        idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
      },
    });

    if (!existsServiceMasterMap) {
      return res.status(400).send("Мастер не оказывает данную услугу");
    }

    const date = moment(value.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    if (!date.isSameOrAfter(moment(), "day")) {
      return res
        .status(400)
        .send("Создать запись можно только для сегодня и будущих дней.");
    }

    const [[{ workingTime }]] = await connection.query(
      `SELECT si.workingTime
      FROM \`${ServiceModel.tableName}\` s
      JOIN \`${SaloonInfoModel.tableName}\` si
      ON s.idSaloon = si.idUserTypeMap
      WHERE s.id =  ${existsServiceMasterMap.idService}`
    );

    const day = date.day();
    if (
      Object.values(JSON.parse(workingTime))[day ? day - 1 : 6].isWorking ===
      false
    ) {
      return res
        .status(400)
        .send("Создать запись можно в рабочий день салона.");
    }

    const { dataValues: emptyServiceStatus } =
      await ServiceInstanceStatusModel.findOne({
        where: { name: SERVICE_INSTANCE_STATUSES.empty.name },
      });

    await ServiceInstanceModel.create({
      idServiceInstanceStatus: emptyServiceStatus.id,
      idServiceMasterMap: value.id,
      time: date
        .format("YYYY-MM-DD")
        .concat(
          `:${value.hours < 10 ? "0".concat(value.hours) : value.hours}-${value.minutes < 10 ? "0".concat(value.minutes) : value.minutes
          }`
        ),
      idClient: null,
      comment: null,
    });

    req.params.date = date.format("DD-MM-YYYY");
    return await timetableInformation(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

// TODO: пересмотреть удаление после завершения первой итерации разработки
const cancelServiceInstance = async (req, res) => {
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);

    const { userTypeMapId, serviceInstanceId } = req.params;

    const serviceInstanceToBeCanceled = await ServiceInstanceModel.findOne({
      where: {
        id: serviceInstanceId,
      },
    });

    if (!serviceInstanceToBeCanceled) {
      return res.status(400).send("Нельзя отменить несуществующую услугу");
    }

    const { dataValues: activeServiceMasterMapStatus } = await ServiceMasterMapStatusModel.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const existsServiceMasterMap = await ServiceMasterMapModel.findOne({
      where: {
        id: serviceInstanceToBeCanceled.dataValues.idServiceMasterMap,
        idMaster: userTypeMapId,
        idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
      },
    });

    if (!existsServiceMasterMap) {
      return res
        .status(400)
        .send("Данный мастер не является исполнителем услуги");
    }

    const date = moment(
      serviceInstanceToBeCanceled.dataValues.time.split(":")[0],
      "YYYY-MM-DD",
      true
    );

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    if (!date.isSameOrAfter(moment(), "day")) {
      return res
        .status(400)
        .send("Отменить запись можно только для сегодня и будущих дней.");
    }

    const { dataValues: removedServiceStatus } =
      await ServiceInstanceStatusModel.findOne({
        where: { name: SERVICE_INSTANCE_STATUSES.removed.name },
      });

    await ServiceInstanceModel.update(
      { idServiceInstanceStatus: removedServiceStatus.id },
      { where: { id: serviceInstanceToBeCanceled.id } }
    );

    req.params.date = date.format("DD-MM-YYYY");
    return await timetableInformation(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getServicesBySaloon,
  createServiceInstance,
  cancelServiceInstance,
};
