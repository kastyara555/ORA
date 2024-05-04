const { connection } = require("../../db/connection");
const SaloonInfo = require("../../db/models/SaloonInfo");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const City = require("../../db/models/City");
const { procedureDataSchema } = require("../../schemas/procedureDataSchema");

const getProcedureData = async (req, res) => {
  try {
    const ProcedureModel = await Procedure(connection);

    const { value, error } = procedureDataSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const existProcedure = await ProcedureModel.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    // const date = moment(value.date, "DD-MM-YYYY", true);

    // if (!date.isValid()) {
    //   return res.status(400).send("Неверный формат даты.");
    // }

    // if (!date.isSameOrAfter(moment(), "day")) {
    //   return res
    //     .status(400)
    //     .send(
    //       "Просматривать доступные записи можно только для сегодня и будущих дней."
    //     );
    // }

    res.send({
      procedureName: existProcedure.dataValues.name,
    });
  } catch (e) {
    res.status(500).send();
  }
};

const getProcedureCities = async (req, res) => {
  try {
    const SaloonInfoModel = await SaloonInfo(connection);
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);
    const CityModel = await City(connection);

    const existProcedure = await ProcedureModel.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    const [cities] = await connection.query(
      `SELECT DISTINCT c.id as id, c.name as name
      FROM \`${ServiceModel.tableName}\` s
      JOIN \`${SaloonInfoModel.tableName}\` si
      ON s.idSaloon = si.idUserTypeMap
      JOIN \`${CityModel.tableName}\` c
      ON si.idCity = c.id
      WHERE s.idProcedure = ${req.params.procedureId}`
    );

    res.send({ name: existProcedure.dataValues.name, cities });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getProcedureData,
  getProcedureCities,
};
