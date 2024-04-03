const { connection } = require("../../db/connection");
const GroupProcedureMap = require("../../db/models/GroupProcedureMap");
const Procedure = require("../../db/models/Procedure");
const ProcedureGroup = require("../../db/models/ProcedureGroup");
const {
  searchProceduresByNameSchema,
} = require("../../schemas/searchProceduresByNameSchema");
const { DEFAULT_SEARCH_PROCEDURES_LIMIT } = require("../../const");

const getProcedureGroups = async (req, res) => {
  const categories = await ProcedureGroup(connection).findAll();

  res.send(Object.values(categories));
};

const getProceduresTree = async (req, res) => {
  try {
    const ProcedureGroupModel = ProcedureGroup(connection);
    const GroupProcedureMapModel = GroupProcedureMap(connection);
    const ProcedureModel = Procedure(connection);

    const tmp = await connection.query(
      `SELECT pg.id as groupId, pg.name as groupName, p.id as procedureId, p.name as procedureName
      FROM \`${ProcedureGroupModel.tableName}\` pg
      JOIN \`${GroupProcedureMapModel.tableName}\` gpm
      ON gpm.idProcedureGroup = pg.id
      JOIN \`${ProcedureModel.tableName}\` p
      ON gpm.idProcedure = p.id
      WHERE gpm.id IN (
        SELECT id FROM (
          SELECT id
          FROM \`group_procedure_map\` gpm
          WHERE gpm.idProcedureGroup = pg.id
          LIMIT 3
        )
        tmp)
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

    res.send(Object.values(result));
  } catch (e) {
    res.status(500).send();
  }
};

const getProceduresByGroupId = async (req, res) => {
  try {
    const GroupProcedureMapModel = GroupProcedureMap(connection);
    const ProcedureModel = Procedure(connection);

    const procedures = await connection.query(
      `SELECT *
      FROM \`${GroupProcedureMapModel.tableName}\` map
      JOIN \`${ProcedureModel.tableName}\` p
      ON map.idProcedure = p.id
      WHERE map.idProcedureGroup = ${req.params.categoryId}`
    );

    res.send(procedures);
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

    const GroupProcedureMapModel = GroupProcedureMap(connection);
    const ProcedureModel = Procedure(connection);

    const procedures = await connection.query(
      `SELECT gpm.idProcedureGroup as procedureGroupId, p.id as procedureId, p.name as procedureName
      FROM  \`${GroupProcedureMapModel.tableName}\` gpm
      JOIN \`${ProcedureModel.tableName}\` p
      ON gpm.idProcedure = p.id
      WHERE gpm.id IN (
        SELECT id FROM (
          SELECT id
            FROM \`${GroupProcedureMapModel.tableName}\` gpm
            WHERE gpm.idProcedure = p.id
            AND LOWER(p.name) LIKE '%${req.params.search.toLowerCase()}%'
            LIMIT 1
          )
        tmp)
      ORDER BY procedureName
      LIMIT ${pageSize ? pageSize : DEFAULT_SEARCH_PROCEDURES_LIMIT}`
    );

    res.send(procedures[0]);
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
