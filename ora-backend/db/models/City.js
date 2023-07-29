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
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "city",
    }
  );

  module.exports = City;
