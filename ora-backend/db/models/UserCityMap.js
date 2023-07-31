const { DataTypes } = require("sequelize");

const User = require("./User");
const City = require("./City");

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
          model: User(sequelize),
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
