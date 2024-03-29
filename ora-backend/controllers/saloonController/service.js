const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const {
  saloonDeleteServicesSchema,
} = require("../../schemas/saloonDeleteServicesSchema");
const {
  saloonAddServicesSchema,
} = require("../../schemas/saloonAddServicesSchema");

const getSaloonServices = async (req, res) => {
  try {
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);

    const [procedureData] = await connection.query(
      `SELECT s.id as id, p.name as name
      FROM \`${ServiceModel.tableName}\` s
      JOIN \`${ProcedureModel.tableName}\` p
      ON s.idProcedure = p.id
      WHERE s.idSaloon = ${req.params.userTypeMapId}`
    );

    return res.send(procedureData);
  } catch (e) {
    res.status(500).send();
  }
};

const deleteSaloonServices = async (req, res) => {
  // TODO: пересмотреть удаление после завершения первой итерации разработки
  try {
    const ServiceModel = await Service(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);

    const { value, error } = saloonDeleteServicesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { codes } = value;

    await ServiceMasterMapModel.destroy({
      where: {
        idService: {
          [Op.in]: codes,
        },
      },
    });

    await ServiceModel.destroy({
      where: {
        id: {
          [Op.in]: codes,
        },
      },
    });

    return await getSaloonServices(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const addSaloonServices = async (req, res) => {
  try {
    const ServiceModel = await Service(connection);
    const ProcedureModel = await Procedure(connection);

    const { value, error } = saloonAddServicesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { services } = value;

    const validProcedures = await ProcedureModel.findAll({
      where: {
        id: {
          [Op.in]: services.map(({ procedureId }) => procedureId),
        },
      },
    });

    if (validProcedures.length !== services.length) {
      return res
        .status(400)
        .send("Среди отправленных процедур имеются невалидные");
    }

    const duplicateProcedures = await ServiceModel.findAll({
      where: {
        idSaloon: req.params.userTypeMapId,
        idProcedure: {
          [Op.in]: services.map(({ procedureId }) => procedureId),
        },
      },
    });

    if (duplicateProcedures.length) {
      return res
        .status(400)
        .send("Добавляемая(-ые) процедура(-ы) уже есть в списке услуг");
    }

    await ServiceModel.bulkCreate(
      services.map(({ procedureId, description, hours, minutes }) => ({
        idSaloon: req.params.userTypeMapId,
        idProcedure: procedureId,
        time: `${hours < 10 ? "0".concat(hours) : hours}:${
          minutes < 10 ? "0".concat(minutes) : minutes
        }`,
        description,
      }))
    );

    return await getSaloonServices(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getSaloonServices, deleteSaloonServices, addSaloonServices };
