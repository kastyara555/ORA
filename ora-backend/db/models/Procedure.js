const { DataTypes } = require("sequelize");
const ProcedureGroup = require("./ProcedureGroup");

const Procedure = (sequelize) =>
  sequelize.define(
    "procedure",
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "procedure",
    }
  );

module.exports = Procedure;
