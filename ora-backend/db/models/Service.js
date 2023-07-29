const { DataTypes } = require("sequelize");

const Master = require("./Master");
const Saloon = require("./Saloon");
const Procedure = require("./Procedure");

const Service = (sequelize) =>
  sequelize.define(
    "service",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idMaster: {
        type: DataTypes.INTEGER,
        references: {
          model: Master(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idSaloon: {
        type: DataTypes.INTEGER,
        references: {
          model: Saloon(sequelize),
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
        allowNull: false,
      },
    },
    {
      tableName: "service",
    }
  );

module.exports = Service;
