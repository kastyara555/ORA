const { DataTypes } = require("sequelize");

const City = (sequelize) =>
  sequelize.define(
    "city",
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
      alias: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      xCoordinate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      yCoordinate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "city",
    }
  );

  module.exports = City;
