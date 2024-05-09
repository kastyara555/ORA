const { connection } = require("../../db/connection");
const SaloonInfo = require("../../db/models/SaloonInfo");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const City = require("../../db/models/City");

const getProcedureDataByCity = async (req, res) => {
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

    const existCity = await CityModel.findOne({
      where: { id: req.params.cityId },
    });

    if (!existCity) {
      return res.status(404).send("Города не существует.");
    }

    const [saloonsData] = await connection.query(
      `SELECT DISTINCT si.id as id, si.name as name, si.description as description
      FROM \`${SaloonInfoModel.tableName}\` si
      JOIN \`${ServiceModel.tableName}\` s
      ON s.idSaloon = si.idUserTypeMap
      WHERE s.idProcedure = ${existProcedure.dataValues.id}
      AND si.idCity = ${existCity.dataValues.id}`
    );

    res.send({
      cityName: existCity.dataValues.name,
      procedureName: existProcedure.dataValues.name,
      saloons: saloonsData,
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
  getProcedureDataByCity,
  getProcedureCities,
};
