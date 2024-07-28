const { DataTypes } = require("sequelize");

const ServiceMasterMapStatus = (sequelize) =>
  sequelize.define(
    "service_master_map_status",
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
      tableName: "service_master_map_status",
    }
  );

module.exports = ServiceMasterMapStatus;
