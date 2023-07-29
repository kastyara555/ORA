const { DataTypes } = require("sequelize");

const ServiceInstanceStatus = (sequelize) =>
  sequelize.define(
    "service_instance_status",
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
      tableName: "service_instance_status",
    }
  );

module.exports = ServiceInstanceStatus;
