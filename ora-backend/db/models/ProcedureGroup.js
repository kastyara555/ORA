const { DataTypes } = require("sequelize");

const ProcedureGroup = (sequelize) =>
  sequelize.define(
    "procedure_group",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "procedure_group",
    }
  );

module.exports = ProcedureGroup;
