const { DataTypes } = require("sequelize");

const ClientStatus = require("./ClientStatus");

const Client = (sequelize) =>
  sequelize.define(
    "client",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idClientStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: ClientStatus(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: {
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
      tableName: "client",
    }
  );

module.exports = Client;
