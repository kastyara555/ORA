const { DataTypes } = require("sequelize");

const StreetType = (sequelize) =>
  sequelize.define(
    "street_type",
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
      shortName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "street_type",
    }
  );

module.exports = StreetType;
