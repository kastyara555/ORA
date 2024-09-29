const { DataTypes } = require("sequelize");

const City = require("./City");
const UserTypeMap = require("./UserTypeMap");
const StreetType = require("./StreetType");

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
      idStreetType: {
        type: DataTypes.INTEGER,
        references: {
          model: StreetType(sequelize),
          key: "id",
        },
        allowNull: true,
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
      name:{
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "saloon_info",
    }
  );

module.exports = SaloonInfo;
