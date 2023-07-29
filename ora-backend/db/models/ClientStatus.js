const { DataTypes } = require("sequelize");

const ClientStatus = (sequelize) =>
  sequelize.define(
    "client_status",
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "client_status",
    }
  );

module.exports = ClientStatus;
