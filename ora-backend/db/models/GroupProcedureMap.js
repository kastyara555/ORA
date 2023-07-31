const { DataTypes } = require("sequelize");

const ProcedureGroup = require("./ProcedureGroup");
const Procedure = require("./Procedure");

const GroupProcedureMap = (sequelize) =>
  sequelize.define(
    "group_procedure_map",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idProcedureGroup: {
        type: DataTypes.INTEGER,
        references: {
          model: ProcedureGroup(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idProcedure: {
        type: DataTypes.INTEGER,
        references: {
          model: Procedure(sequelize),
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "group_procedure_map",
    }
  );

module.exports = GroupProcedureMap;
