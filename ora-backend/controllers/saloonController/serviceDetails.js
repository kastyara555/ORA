const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
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
    const {
      service_master_map_status,
      saloon_master_map_status,
      service_master_map,
      saloon_master_map,
      user_type_map,
      user_image,
      procedure,
      service,
      user,
    } = connection.models;

    const serviceBaseInfo = await service.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceBaseInfo) {
      return res.status(400).send("Нет информации об услуге.");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name
        },
      },
    );

    const procedureBaseInfo = await procedure.findOne({
      where: { id: serviceBaseInfo.dataValues.idProcedure },
    });

    if (!procedureBaseInfo) {
      return res.status(400).send("Нет информации о процедуре.");
    }

    const saloonMasters = await saloon_master_map.findAll({
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
      FROM \`${user_type_map.tableName}\` user_type_map
      JOIN \`${user.tableName}\` user
      ON user.id = user_type_map.idUser
      JOIN \`${service_master_map.tableName}\` service_master_map
      ON service_master_map.idMaster = user_type_map.id
      JOIN \`${service_master_map_status.tableName}\` service_master_map_status
      ON service_master_map.idServiceMasterMapStatus = service_master_map_status.id
      JOIN \`${saloon_master_map.tableName}\` saloon_master_map
      ON user_type_map.id = saloon_master_map.idMaster
      JOIN \`${saloon_master_map_status.tableName}\` saloon_master_map_status
      ON saloon_master_map.idSaloonMasterMapStatus = saloon_master_map_status.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${user_image.tableName}\`
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
      FROM \`${user_type_map.tableName}\` user_type_map
      JOIN \`${user.tableName}\` user
      ON user.id = user_type_map.idUser
      JOIN \`${saloon_master_map.tableName}\` saloon_master_map
      ON user_type_map.id = saloon_master_map.idMaster
      JOIN \`${saloon_master_map_status.tableName}\` saloon_master_map_status
      ON saloon_master_map.idSaloonMasterMapStatus = saloon_master_map_status.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${user_image.tableName}\`
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
    const { value, error } = serviceUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { description } = value;
    const { service } = connection.models;

    const serviceBaseInfo = await service.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceBaseInfo) {
      return res.status(400).send("Нет информации об услуге.");
    }

    await service.update(
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
    const { value, error } = serviceMastersAddingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { masters } = value;
    const {
      service_master_map_status,
      saloon_master_map_status,
      service_master_map,
      saloon_master_map,
      service,
    } = connection.models;

    const serviceInfo = await service.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceInfo) {
      return res.status(400).send("Услуга не принадлежит салону");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name
        },
      },
    );

    const requestedMasterIds = masters.map(({ id }) => id);

    const saloonMasters = await saloon_master_map.findAll({
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

    const { dataValues: activeServiceMasterMapStatus } = await service_master_map_status.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const alreadyActiveMasters = await service_master_map.findAll({
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

    await service_master_map.bulkCreate(
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
    const { value, error } = serviceMastersRemovingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { codes } = value;
    const {
      service_master_map_status,
      service_master_map,
      service,
    } = connection.models;

    const serviceInfo = await service.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceInfo) {
      return res.status(400).send("Услуга не принадлежит салону");
    }

    const uniqMasters = new Set(codes);

    if (uniqMasters.size !== codes.length) {
      return res.status(400).send("Удалить можно только уникальные записи");
    }

    const { dataValues: removedServiceMasterMapStatus } = await service_master_map_status.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.removed.name,
      },
    });

    await service_master_map.update(
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
    const { value, error } = serviceMasterUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { master } = value;
    const {
      service_master_map_status,
      saloon_master_map_status,
      service_master_map,
      saloon_master_map,
      service,
    } = connection.models;

    const serviceInfo = await service.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceInfo) {
      return res.status(400).send("Услуга не принадлежит салону");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name
        },
      },
    );

    const saloonMasterInfo = await saloon_master_map.findOne({
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

    const { dataValues: activeServiceMasterMapStatus } = await service_master_map_status.findOne({
      where: {
        name: SERVICES_MASTER_MAP_STATUSES.active.name,
      },
    });

    const alreadyActiveMaster = await service_master_map.findOne({
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

    await service_master_map.update(
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
