const { Op, QueryTypes } = require("sequelize");

const { connection } = require("../../db/connection");
const Procedure = require("../../db/models/Procedure");
const GroupProcedureMap = require("../../db/models/GroupProcedureMap");

const getProceduresByGroupId = async (req, res) => {
  const procedures = await connection.query(
    `SELECT *
    FROM \`${GroupProcedureMap(connection).tableName}\` map JOIN \`${Procedure(connection).tableName}\` p
    ON map.idProcedure = p.id
    WHERE map.idProcedureGroup = :categoryId`,
    {
      replacements: { categoryId: req.params.categoryId },
      type: QueryTypes.SELECT,
    }
  );

  res.send(procedures);
};

module.exports = {
  getProceduresByGroupId,
};
