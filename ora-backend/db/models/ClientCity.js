const { DataTypes } = require("sequelize");

const Client = require("./Client");
const City = require("./City");

const ClientCity = (sequelize) =>
  sequelize.define(
    "client_city",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idClient: {
        type: DataTypes.INTEGER,
        references: {
          model: Client(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idCity: {
        type: DataTypes.INTEGER,
        references: {
          model: City(sequelize),
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "client_city",
    }
  );

module.exports = ClientCity;
