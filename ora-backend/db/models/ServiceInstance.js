const { DataTypes } = require("sequelize");

const UserTypeMap = require("./UserTypeMap");
const ServiceMasterMap = require("./ServiceMasterMap");
const ServiceInstanceStatus = require("./ServiceInstanceStatus");

const ServiceInstance = (sequelize) =>
  sequelize.define(
    "service_instance",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idServiceMasterMap: {
        type: DataTypes.INTEGER,
        references: {
          model: ServiceMasterMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idClient: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
      },
      idServiceInstanceStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: ServiceInstanceStatus(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      comment: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "service_instance",
    }
  );

module.exports = ServiceInstance;
