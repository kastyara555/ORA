const { DataTypes } = require("sequelize");

const SaloonStatus = (sequelize) =>
  sequelize.define(
    "saloon_status",
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
      tableName: "saloon_status",
    }
  );

module.exports = SaloonStatus;
