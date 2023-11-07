const { DataTypes } = require("sequelize");

const City = require("./City");
const UserTypeMap = require("./UserTypeMap");

const SaloonInfo = (sequelize) =>
  sequelize.define(
    "saloon_info",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idCity: {
        type: DataTypes.INTEGER,
        references: {
          model: City(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idUserTypeMap: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
      },
      building: {
        type: DataTypes.STRING,
      },
      stage: {
        type: DataTypes.STRING,
      },
      office: {
        type: DataTypes.STRING,
      },
      visitPayment: {
        type: DataTypes.INTEGER,
      },
      workingTime: {
        type: DataTypes.JSON,
      },
      description: {
        type: DataTypes.JSON,
      },
    },
    {
      tableName: "saloon_info",
    }
  );

module.exports = SaloonInfo;
