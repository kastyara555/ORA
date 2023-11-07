const { DataTypes } = require("sequelize");

const Procedure = require("./Procedure");
const SaloonMasterMap = require("./SaloonMasterMap");

const Service = (sequelize) =>
  sequelize.define(
    "service",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idSaloonMasterMap: {
        type: DataTypes.INTEGER,
        references: {
          model: SaloonMasterMap(sequelize),
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
      description: {
        type: DataTypes.STRING,
      },
      time: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "service",
    }
  );

module.exports = Service;
