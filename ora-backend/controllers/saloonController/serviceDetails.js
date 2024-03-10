const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const UserTypeMap = require("../../db/models/UserTypeMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const MasterInfo = require("../../db/models/MasterInfo");
const User = require("../../db/models/User");
const UserImage = require("../../db/models/UserImage");
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
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const ProcedureModel = await Procedure(connection);
    const UserImageModel = await UserImage(connection);
    const ServiceModel = await Service(connection);
    const UserModel = await User(connection);

    const serviceBaseInfo = await ServiceModel.findOne({
      where: { id: req.params.serviceId, idSaloon: req.params.userTypeMapId },
    });

    if (!serviceBaseInfo) {
      return res.status(400).send("Нет информации об услуге.");
    }

    const procedureBaseInfo = await ProcedureModel.findOne({
      where: { id: serviceBaseInfo.dataValues.idProcedure },
    });

    if (!procedureBaseInfo) {
      return res.status(400).send("Нет информации о процедуре.");
    }

    const saloonMasters = await SaloonMasterMapModel.findAll({
      where: { idSaloon: req.params.userTypeMapId },
    });

    let activeMasters = [];
    let availableMasters = [];

    if (saloonMasters.length) {
      const mastersIds = saloonMasters.map(
        ({ dataValues }) => dataValues.idMaster
      );

      const [mastersData] = await connection.query(
        `SELECT utm.id id, u.name name, u.email as email
      FROM \`${MasterInfoModel.tableName}\` m
      JOIN \`${UserTypeMapModel.tableName}\` utm
      ON utm.id = m.idUserTypeMap
      JOIN \`${UserModel.tableName}\` u
      ON u.id = utm.idUser
      WHERE m.idUserTypeMap IN (${mastersIds.join(", ")})`
      );

      const mainImages = await UserImageModel.findAll({
        where: {
          idUserTypeMap: {
            [Op.in]: mastersIds,
          },
          isMain: true,
        },
      });

      const mappedImages = mainImages
        .map(({ dataValues }) => dataValues)
        .reduce(
          (accum, { idUserTypeMap, url }) => ({
            ...accum,
            [idUserTypeMap]: url,
          }),
          {}
        );

      const preparedAllMasters = mastersData.map((master) => ({
        ...master,
        mainImage: mappedImages[master.id] || null,
      }));

      const activeMastersBaseInfo = await ServiceMasterMapModel.findAll({
        where: {
          idService: req.params.serviceId,
          idMaster: {
            [Op.in]: mastersIds,
          },
        },
      });

      const activeMastersBaseInfoMap = activeMastersBaseInfo
        .map(({ dataValues }) => dataValues)
        .reduce(
          (accum, { idMaster, price }) => ({ ...accum, [idMaster]: price }),
          {}
        );

      activeMasters = preparedAllMasters
        .filter(({ id }) => activeMastersBaseInfoMap[id])
        .map((masterInfo) => ({
          ...masterInfo,
          price: activeMastersBaseInfoMap[masterInfo.id],
        }));

      availableMasters = preparedAllMasters.filter(
        ({ id }) => !activeMastersBaseInfoMap[id]
      );
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

    const requestedMasterIds = masters.map(({ id }) => id);

    const saloonMasters = await SaloonMasterMapModel.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
        idMaster: { [Op.in]: requestedMasterIds },
      },
    });

    if (saloonMasters.length !== masters.length) {
      return res
        .status(400)
        .send("Оказывать услуги могут только мастера, работающие в салоне");
    }

    const alreadyActiveMasters = await ServiceMasterMapModel.findAll({
      where: {
        idService: req.params.serviceId,
        idMaster: {
          [Op.in]: requestedMasterIds,
        },
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

    await ServiceMasterMapModel.destroy({
      where: {
        idService: req.params.serviceId,
        idMaster: {
          [Op.in]: codes,
        },
      },
    });

    return await getSaloonServiceInfo(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const updateServiceMaster = async (req, res) => {
  // TODO: пересмотреть политику изменения цен после построения процесса
  try {
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

    const saloonMasterInfo = await SaloonMasterMapModel.findOne({
      where: {
        idSaloon: req.params.userTypeMapId,
        idMaster: master.id,
      },
    });

    if (!saloonMasterInfo) {
      return res
        .status(400)
        .send("Оказывать услуги могут только мастера, работающие в салоне");
    }

    const alreadyActiveMaster = await ServiceMasterMapModel.findOne({
      where: {
        idService: req.params.serviceId,
        idMaster: master.id,
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
