const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const {
  saloonAddServicesSchema,
} = require("../../schemas/saloonAddServicesSchema");

const getSaloonServices = async (req, res) => {
  try {
    const { procedure, service } = connection.models;

    const [procedureData] = await connection.query(
      `SELECT s.id as id, p.name as name
      FROM ${service.tableName} s
      JOIN ${procedure.tableName} p
      ON s.idProcedure = p.id
      WHERE s.idSaloon = ${req.params.userTypeMapId}`
    );

    return res.send(procedureData);
  } catch (e) {
    res.status(500).send();
  }
};

const addSaloonServices = async (req, res) => {
  try {
    const { value, error } = saloonAddServicesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Тело запроса не соответствует требованиям");
    }

    const { services } = value;
    const { procedure, service } = connection.models;

    const validProcedures = await procedure.findAll({
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

    const duplicateProcedures = await service.findAll({
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

    await service.bulkCreate(
      services.map(({ procedureId, description, hours, minutes }) => ({
        idSaloon: req.params.userTypeMapId,
        idProcedure: procedureId,
        time: `${hours < 10 ? "0".concat(hours) : hours}:${minutes < 10 ? "0".concat(minutes) : minutes
          }`,
        description,
      }))
    );

    return await getSaloonServices(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getSaloonServices, addSaloonServices };
