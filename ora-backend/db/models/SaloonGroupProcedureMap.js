const { DataTypes } = require("sequelize");

const ProcedureGroup = require("./ProcedureGroup");
const UserTypeMap = require("./UserTypeMap");

const SaloonGroupProcedureMap = (sequelize) =>
  sequelize.define(
    "saloon_group_procedure_map",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idUserTypeMap: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idProcedureGroup: {
        type: DataTypes.INTEGER,
        references: {
          model: ProcedureGroup(sequelize),
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "saloon_group_procedure_map",
    }
  );

module.exports = SaloonGroupProcedureMap;
