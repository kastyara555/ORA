const { connection } = require("../../db/connection");
const {
  searchProceduresByNameSchema,
} = require("../../schemas/searchProceduresByNameSchema");
const { DEFAULT_SEARCH_PROCEDURES_LIMIT } = require("../../const");

const getProcedureGroups = async (req, res) => {
  const categories = await connection.models.procedure_group.findAll();

  return res.send(Object.values(categories));
};

const getProceduresTree = async (req, res) => {
  try {
    const {
      group_procedure_map,
      procedure_group,
      procedure,
    } = connection.models;

    const tmp = await connection.query(
      `SELECT pg.id as groupId, pg.name as groupName, p.id as procedureId, p.name as procedureName
      FROM ${procedure_group.tableName} pg
      JOIN ${group_procedure_map.tableName} gpm
      ON gpm.idProcedureGroup = pg.id
      JOIN ${procedure.tableName} p
      ON gpm.idProcedure = p.id
      WHERE gpm.id IN (
        SELECT id FROM (
          SELECT id
          FROM ${group_procedure_map.tableName} gpm
          WHERE gpm.idProcedureGroup = pg.id
          LIMIT 3
        ) tmp)
      ORDER BY groupId`
    );

    const result = {};

    tmp[0].forEach(({ groupId, groupName, procedureId, procedureName }) => {
      if (!result.hasOwnProperty(groupId)) {
        result[groupId] = {
          id: groupId,
          name: groupName,
          procedures: [
            {
              id: procedureId,
              name: procedureName,
            },
          ],
        };
      } else {
        result[groupId].procedures.push({
          id: procedureId,
          name: procedureName,
        });
      }
    });

    return res.send(Object.values(result));
  } catch (e) {
    res.status(500).send();
  }
};

const getProceduresByGroupId = async (req, res) => {
  try {
    const {
      group_procedure_map,
      procedure,
    } = connection.models;

    const procedures = await connection.query(
      `SELECT *
      FROM ${group_procedure_map.tableName} map
      JOIN ${procedure.tableName} p
      ON map.idProcedure = p.id
      WHERE map.idProcedureGroup = ${req.params.categoryId}`
    );

    return res.send(procedures);
  } catch (e) {
    res.status(500).send();
  }
};

const getProceduresByName = async (req, res) => {
  try {
    const { value, error } = searchProceduresByNameSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Лимит процедур указан неверно");
    }

    const { pageSize } = value;

    const {
      group_procedure_map,
      procedure,
    } = connection.models;

    const procedures = await connection.query(
      `SELECT gpm.idProcedureGroup as procedureGroupId, p.id as procedureId, p.name as procedureName
      FROM  ${group_procedure_map.tableName} gpm
      JOIN ${procedure.tableName} p
      ON gpm.idProcedure = p.id
      WHERE gpm.id IN (
        SELECT id FROM (
          SELECT id
            FROM ${group_procedure_map.tableName} gpm
            WHERE gpm.idProcedure = p.id
            AND LOWER(p.name) LIKE '%${req.params.search.toLowerCase()}%'
            LIMIT 1
        ) tmp)
      ORDER BY procedureName
      LIMIT ${pageSize ? pageSize : DEFAULT_SEARCH_PROCEDURES_LIMIT}`
    );

    return res.send(procedures[0]);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getProcedureGroups,
  getProceduresTree,
  getProceduresByGroupId,
  getProceduresByName,
};
