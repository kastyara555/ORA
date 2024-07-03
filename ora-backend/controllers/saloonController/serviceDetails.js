const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const ServiceMasterMapStatus = require("../../db/models/ServiceMasterMapStatus");
const SaloonMasterMapStatus = require("../../db/models/SaloonMasterMapStatus");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const UserTypeMap = require("../../db/models/UserTypeMap");
const UserImage = require("../../db/models/UserImage");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const User = require("../../db/models/User");
const {
  serviceUpdatingSchema,
} = require("../../schemas/serviceUpdatingSchema");
const {
  serviceMastersRemovingSchema,
} = require("../../schemas/serviceMastersRemovingSchema");
const {
  serviceMastersAddingSchema,
} = require("../../schemas/serviceMastersAddingSchema");
const {
  serviceMasterUpdatingSchema,
} = require("../../schemas/serviceMasterUpdatingSchema");

const getSaloonServiceInfo = async (req, res) => {
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserImageModel = await UserImage(connection);
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);
    const UserModel = await User(connection);

    const serviceBaseInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceBaseInfo) {
      return res.status(400).send("Нет информации об услуге.");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await SaloonMasterMapStatusModel.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name
        },
      },
    );

    const procedureBaseInfo = await ProcedureModel.findOne({
      where: { id: serviceBaseInfo.dataValues.idProcedure },
    });

    if (!procedureBaseInfo) {
      return res.status(400).send("Нет информации о процедуре.");
    }

    const saloonMasters = await SaloonMasterMapModel.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
        idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
      },
    });

    let activeMasters = [];
    let availableMasters = [];

    if (saloonMasters.length) {
      const mastersIds = saloonMasters.map(
        ({ dataValues }) => dataValues.idMaster,
      );

      activeMasters = (await connection.query(
        `SELECT user_type_map.id as id, user.name as name, user.email as email, uim.url as mainImage, service_master_map.price as price
      FROM \`${UserTypeMapModel.tableName}\` user_type_map
      JOIN \`${UserModel.tableName}\` user
      ON user.id = user_type_map.idUser
      JOIN \`${ServiceMasterMapModel.tableName}\` service_master_map
      ON service_master_map.idMaster = user_type_map.id
      JOIN \`${ServiceMasterMapStatusModel.tableName}\` service_master_map_status
      ON service_master_map.idServiceMasterMapStatus = service_master_map_status.id
      JOIN \`${SaloonMasterMapModel.tableName}\` saloon_master_map
      ON user_type_map.id = saloon_master_map.idMaster
      JOIN \`${SaloonMasterMapStatusModel.tableName}\` saloon_master_map_status
      ON saloon_master_map.idSaloonMasterMapStatus = saloon_master_map_status.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${UserImageModel.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = user_type_map.id
      WHERE user_type_map.id IN (${mastersIds.join(", ")})
      AND saloon_master_map.idSaloon = ${req.params.userTypeMapId}
      AND saloon_master_map_status.name = '${SALOON_MASTER_MAP_STATUSES.active.name}'
      AND service_master_map.idService = ${req.params.serviceId}
      AND service_master_map_status.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'`
      ))[0];

      availableMasters = (await connection.query(
        `SELECT DISTINCT user_type_map.id as id, user.name as name, user.email as email, uim.url as mainImage
      FROM \`${UserTypeMapModel.tableName}\` user_type_map
      JOIN \`${UserModel.tableName}\` user
      ON user.id = user_type_map.idUser
      JOIN \`${SaloonMasterMapModel.tableName}\` saloon_master_map
      ON user_type_map.id = saloon_master_map.idMaster
      JOIN \`${SaloonMasterMapStatusModel.tableName}\` saloon_master_map_status
      ON saloon_master_map.idSaloonMasterMapStatus = saloon_master_map_status.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${UserImageModel.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = user_type_map.id
      WHERE user_type_map.id IN (${mastersIds.join(", ")})
      ${activeMasters.length ? `AND user_type_map.id NOT IN (${activeMasters.map(({ id }) => id).join(", ")})` : ''}
      AND saloon_master_map.idSaloon = ${req.params.userTypeMapId}
      AND saloon_master_map_status.name = '${SALOON_MASTER_MAP_STATUSES.active.name}'`
      ))[0];
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

const updateService = async (req, res) => {
  try {
    const ServiceModel = await Service(connection);

    const { value, error } = serviceUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { description } = value;

    const serviceBaseInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceBaseInfo) {
      return res.status(400).send("Нет информации об услуге.");
    }

    await ServiceModel.update(
      { description },
      {
        where: {
          id: req.params.serviceId,
        },
      }
    );

    return await getSaloonServiceInfo(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const addServiceMasters = async (req, res) => {
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const ServiceModel = await Service(connection);

    const { value, error } = serviceMastersAddingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { masters } = value;

    const serviceInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceInfo) {
      return res.status(400).send("Услуга не принадлежит салону");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await SaloonMasterMapStatusModel.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name
        },
      },
    );

    const requestedMasterIds = masters.map(({ id }) => id);

    const saloonMasters = await SaloonMasterMapModel.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
        idMaster: { [Op.in]: requestedMasterIds },
        idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
      },
    });

    if (saloonMasters.length !== masters.length) {
      return res
        .status(400)
        .send("Оказывать услуги могут только мастера, работающие в салоне");
    }

    const { dataValues: activeServiceMasterMapStatus } = await ServiceMasterMapStatusModel.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const alreadyActiveMasters = await ServiceMasterMapModel.findAll({
      where: {
        idService: req.params.serviceId,
        idMaster: {
          [Op.in]: requestedMasterIds,
        },
        idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
      },
    });

    if (alreadyActiveMasters.length) {
      return res
        .status(400)
        .send("Добавляемый(-ые) мастер(-а) уже оказывают данную услугу");
    }

    await ServiceMasterMapModel.bulkCreate(
      masters.map(({ id, price }) => ({
        idService: req.params.serviceId,
        idMaster: id,
        idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
        price,
      }))
    );

    return await getSaloonServiceInfo(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const removeServiceMasters = async (req, res) => {
  // TODO: После построения полного процесса пересмотреть удаление
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceModel = await Service(connection);

    const { value, error } = serviceMastersRemovingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { codes } = value;

    const serviceInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceInfo) {
      return res.status(400).send("Услуга не принадлежит салону");
    }

    const uniqMasters = new Set(codes);

    if (uniqMasters.size !== codes.length) {
      return res.status(400).send("Удалить можно только уникальные записи");
    }

    const { dataValues: removedServiceMasterMapStatus } = await ServiceMasterMapStatusModel.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.removed.name,
      },
    });

    await ServiceMasterMapModel.update(
      {
        idServiceMasterMapStatus: removedServiceMasterMapStatus.id,
      },
      {
        where: {
          idService: req.params.serviceId,
          idMaster: {
            [Op.in]: codes,
          },
        },
      }
    );

    return await getSaloonServiceInfo(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const updateServiceMaster = async (req, res) => {
  // TODO: пересмотреть политику изменения цен после построения процесса
  try {
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const ServiceModel = await Service(connection);

    const { value, error } = serviceMasterUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { master } = value;

    const serviceInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceInfo) {
      return res.status(400).send("Услуга не принадлежит салону");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await SaloonMasterMapStatusModel.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name
        },
      },
    );

    const saloonMasterInfo = await SaloonMasterMapModel.findOne({
      where: {
        idSaloon: req.params.userTypeMapId,
        idMaster: master.id,
        idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
      },
    });

    if (!saloonMasterInfo) {
      return res
        .status(400)
        .send("Оказывать услуги могут только мастера, работающие в салоне");
    }

    const { dataValues: activeServiceMasterMapStatus } = await ServiceMasterMapStatusModel.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const alreadyActiveMaster = await ServiceMasterMapModel.findOne({
      where: {
        idService: req.params.serviceId,
        idMaster: master.id,
        idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
      },
    });

    if (!alreadyActiveMaster) {
      return res
        .status(400)
        .send(
          "Обновить данные можно только для мастеров, которые оказывают данную услугу"
        );
    }

    await ServiceMasterMapModel.update(
      { price: master.price },
      {
        where: {
          idService: req.params.serviceId,
          idMaster: master.id,
          idServiceMasterMapStatus: activeServiceMasterMapStatus.id,
        },
      }
    );

    return await getSaloonServiceInfo(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getSaloonServiceInfo,
  updateService,
  addServiceMasters,
  removeServiceMasters,
  updateServiceMaster,
};
