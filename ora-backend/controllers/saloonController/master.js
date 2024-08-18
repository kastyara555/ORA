const { Op } = require("sequelize");
const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { SERVICE_INSTANCE_STATUSES } = require("../../db/consts/serviceInstanceStatuses");
const {
  saloonDeleteMastersSchema,
} = require("../../schemas/saloonDeleteMastersSchema");
const {
  saloonAddMasterSchema,
} = require("../../schemas/saloonAddMasterSchema");

const getSaloonMasters = async (req, res) => {
  try {
    const {
      saloon_master_map_status,
      saloon_master_map,
      user_type_map,
      master_info,
      user_image,
      user,
    } = connection.models;

    const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne({
      where: {
        name: SALOON_MASTER_MAP_STATUSES.active.name
      },
    });

    const masters = await saloon_master_map.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
        idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
      },
    });

    if (!masters.length) {
      return res.send([]);
    }

    const mastersIds = masters.map(({ dataValues }) => dataValues.idMaster);

    const [mastersData] = await connection.query(
      `SELECT utm.id code, u.name name, u.email as email, u.phone as phone, uim.url as mainImage 
      FROM ${master_info.tableName} m
      JOIN ${user_type_map.tableName} utm
      ON utm.id = m.idUserTypeMap
      JOIN ${user.tableName} u
      ON u.id = utm.idUser
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM ${user_image.tableName}
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = m.idUserTypeMap
      WHERE m.idUserTypeMap IN (${mastersIds.join(", ")})`
    );

    return res.send(mastersData);
  } catch (e) {
    res.status(500).send();
  }
};

const deleteSaloonMasters = async (req, res) => {
  try {
    const { value, error } = saloonDeleteMastersSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { codes } = value;
    const {
      service_master_map_status,
      saloon_master_map_status,
      service_instance_status,
      service_master_map,
      saloon_master_map,
      service_instance,
      service,
    } = connection.models;

    const saloonMasterMapStatusesMap = (await saloon_master_map_status.findAll({
      where: {
        name: {
          [Op.in]: [SALOON_MASTER_MAP_STATUSES.active.name, SALOON_MASTER_MAP_STATUSES.removed.name],
        },
      },
    })
    ).map(({ dataValues }) => dataValues)
      .reduce(
        (accum, status) => ({
          ...accum,
          [status.name]: status.id,
        }),
        {}
      );

    // Актуализируем информацию о том, что связка салон-мастер не актуальна
    await saloon_master_map.update(
      { idSaloonMasterMapStatus: saloonMasterMapStatusesMap[SALOON_MASTER_MAP_STATUSES.removed.name] },
      {
        where: {
          idSaloon: +req.params.userTypeMapId,
          idMaster: {
            [Op.in]: codes,
          },
          idSaloonMasterMapStatus: saloonMasterMapStatusesMap[SALOON_MASTER_MAP_STATUSES.active.name],
        },
      }
    );

    const serviceMasterMapElementsToBeRemoved = (await connection.query(
      `SELECT smm.id as id
      FROM ${service_master_map.tableName} smm
      JOIN ${service_master_map_status.tableName} smms
      ON smm.idServiceMasterMapStatus = smms.id
      JOIN ${service.tableName} s
      ON smm.idService = s.id
      WHERE s.idSaloon = ${req.params.userTypeMapId}
      AND smm.idMaster IN (${codes.join(',')})
      AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'`
    ))[0].map(({ id }) => id);

    if (serviceMasterMapElementsToBeRemoved.length) {
      // Актуализируем связку сервис-мастер
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
            id: {
              [Op.in]: serviceMasterMapElementsToBeRemoved,
            },
          },
        },
      );

      // Отменяем запись услуги
      const { dataValues: serviceInstanceRemovedStatus } = await service_instance_status.findOne({
        where: {
          name: SERVICE_INSTANCE_STATUSES.removed.name,
        },
      });

      await service_instance.update(
        {
          idServiceInstanceStatus: serviceInstanceRemovedStatus.id,
        },
        {
          where: {
            idServiceMasterMap: {
              [Op.in]: serviceMasterMapElementsToBeRemoved,
            }
          },
        }
      );
    }

    return await getSaloonMasters(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const addSaloonMaster = async (req, res) => {
  try {
    const { value, error } = saloonAddMasterSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { code } = value;
    const {
      saloon_master_map_status,
      saloon_master_map,
      user_type_map,
      user_type,
    } = connection.models;

    const { dataValues: masterUserType } = await user_type.findOne({
      where: {
        name: roles.master.name,
      },
    });

    const masterRecordInMap = await user_type_map.findOne({
      where: {
        id: code,
        idUserType: masterUserType.id,
      },
    });

    if (!masterRecordInMap) {
      return res.status(400).send("Мастер не найден");
    }

    const [activeMasters] = await connection.query(
      `SELECT *
      FROM ${saloon_master_map.tableName} smm
      JOIN ${saloon_master_map_status.tableName} smms
      ON smm.idSaloonMasterMapStatus = smms.id
      WHERE smm.idSaloon = ${req.params.userTypeMapId}
      AND smm.idMaster = ${code}
      AND smms.name = '${SALOON_MASTER_MAP_STATUSES.active.name}'`
    );

    if (activeMasters.length) {
      return res.status(400).send("Мастер уже добавлен в Ваш салон");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await saloon_master_map_status.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name,
        },
      },
    );

    await saloon_master_map.create({
      idSaloon: req.params.userTypeMapId,
      idMaster: code,
      idSaloonMasterMapStatus: activeSaloonMasterMapStatus.id,
    });

    return res.send({});
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getSaloonMasters, deleteSaloonMasters, addSaloonMaster };
