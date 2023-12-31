const { DataTypes } = require("sequelize");

const Service = require("./Service");
const User = require("./User");
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
      idService: {
        type: DataTypes.INTEGER,
        references: {
          model: Service(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idClient: {
        type: DataTypes.INTEGER,
        references: {
          model: User(sequelize),
          key: "id",
        },
        allowNull: false,
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
