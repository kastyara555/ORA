const { DataTypes } = require("sequelize");

const Sex = (sequelize) =>
  sequelize.define(
    "sex",
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
    },
    {
      tableName: "sex",
    }
  );

module.exports = Sex;
