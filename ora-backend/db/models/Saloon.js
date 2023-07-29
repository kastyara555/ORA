const { DataTypes } = require("sequelize");

const City = require("./City");
const SaloonStatus = require("./SaloonStatus");

const Saloon = (sequelize) =>
  sequelize.define(
    "saloon",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idSaloonStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: SaloonStatus(sequelize),
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "saloon",
    }
  );

module.exports = Saloon;
