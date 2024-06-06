const { DataTypes } = require("sequelize");

const City = require("./City");
const UserTypeMap = require("./UserTypeMap");

const UserCityMap = (sequelize) =>
  sequelize.define(
    "user_city_map",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idUser: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idCity: {
        type: DataTypes.INTEGER,
        references: {
          model: City(sequelize),
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "user_city_map",
    }
  );

module.exports = UserCityMap;
