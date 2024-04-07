const { DataTypes } = require("sequelize");

const UserTypeMap = require("./UserTypeMap");
const Service = require("./Service");

const ServiceMasterMap = (sequelize) =>
  sequelize.define(
    "service_master_map",
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
      idMaster: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
      }
    },
    {
      tableName: "service_master_map",
    }
  );

module.exports = ServiceMasterMap;
