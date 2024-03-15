const { DataTypes } = require("sequelize");

const StreetType = (sequelize) =>
  sequelize.define(
    "street_types",
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
      tableName: "street_types",
    }
  );

module.exports = StreetType;
