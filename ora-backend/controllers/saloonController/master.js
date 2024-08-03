const { Op } = require("sequelize");
const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const { SALOON_MASTER_MAP_STATUSES } = require("../../db/consts/saloonMasterMapStatuses");
const { SERVICE_INSTANCE_STATUSES } = require("../../db/consts/serviceInstanceStatuses");
const ServiceMasterMapStatus = require("../../db/models/ServiceMasterMapStatus");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const SaloonMasterMapStatus = require("../../db/models/SaloonMasterMapStatus");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const UserTypeMap = require("../../db/models/UserTypeMap");
const MasterInfo = require("../../db/models/MasterInfo");
const UserImage = require("../../db/models/UserImage");
const UserType = require("../../db/models/UserType");
const Service = require("../../db/models/Service");
const User = require("../../db/models/User");
const {
  saloonDeleteMastersSchema,
} = require("../../schemas/saloonDeleteMastersSchema");
const {
  saloonAddMasterSchema,
} = require("../../schemas/saloonAddMasterSchema");

const getSaloonMasters = async (req, res) => {
  try {
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const UserImageModel = await UserImage(connection);
    const UserModel = await User(connection);

    const { dataValues: activeSaloonMasterMapStatus } = await SaloonMasterMapStatusModel.findOne({
      where: {
        name: SALOON_MASTER_MAP_STATUSES.active.name
      },
    });

    const masters = await SaloonMasterMapModel.findAll({
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
      FROM \`${MasterInfoModel.tableName}\` m
      JOIN \`${UserTypeMapModel.tableName}\` utm
      ON utm.id = m.idUserTypeMap
      JOIN \`${UserModel.tableName}\` u
      ON u.id = utm.idUser
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${UserImageModel.tableName}\`
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
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const ServiceModel = await Service(connection);

    const { value, error } = saloonDeleteMastersSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { codes } = value;

    const saloonMasterMapStatusesMap = (await SaloonMasterMapStatusModel.findAll({
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
    await SaloonMasterMapModel.update(
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
      FROM \`${ServiceMasterMapModel.tableName}\` smm
      JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
      ON smm.idServiceMasterMapStatus = smms.id
      JOIN \`${ServiceModel.tableName}\` s
      ON smm.idService = s.id
      WHERE s.idSaloon = ${req.params.userTypeMapId}
      AND smm.idMaster IN (${codes.join(',')})
      AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'`
    ))[0].map(({ id }) => id);

    if (serviceMasterMapElementsToBeRemoved.length) {
      // Актуализируем связку сервис-мастер
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
            id: {
              [Op.in]: serviceMasterMapElementsToBeRemoved,
            },
          },
        },
      );

      // Отменяем запись услуги
      const { dataValues: serviceInstanceRemovedStatus } = await ServiceInstanceStatusModel.findOne({
        where: {
          name: SERVICE_INSTANCE_STATUSES.removed.name,
        },
      });

      await ServiceInstanceModel.update(
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
    const SaloonMasterMapStatusModel = await SaloonMasterMapStatus(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserTypeModel = await UserType(connection);

    const { value, error } = saloonAddMasterSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { code } = value;

    const { dataValues: masterUserType } = await UserTypeModel.findOne({
      where: {
        name: roles.master.name,
      },
    });

    const masterRecordInMap = await UserTypeMapModel.findOne({
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
      FROM \`${SaloonMasterMapModel.tableName}\` smm
      JOIN \`${SaloonMasterMapStatusModel.tableName}\` smms
      ON smm.idSaloonMasterMapStatus = smms.id
      WHERE smm.idSaloon = ${req.params.userTypeMapId}
      AND smm.idMaster = ${code}
      AND smms.name = '${SALOON_MASTER_MAP_STATUSES.active.name}'`
    );

    if (activeMasters.length) {
      return res.status(400).send("Мастер уже добавлен в Ваш салон");
    }

    const { dataValues: activeSaloonMasterMapStatus } = await SaloonMasterMapStatusModel.findOne(
      {
        where: {
          name: SALOON_MASTER_MAP_STATUSES.active.name,
        },
      },
    );

    await SaloonMasterMapModel.create({
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
