const { DataTypes } = require("sequelize");

const MasterStatus = (sequelize) =>
  sequelize.define(
    "master_status",
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
      tableName: "master_status",
    }
  );

module.exports = MasterStatus;
