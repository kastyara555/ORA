const { DataTypes } = require("sequelize");

const Service = require("./Service");
const UserTypeMap = require("./UserTypeMap");

const Favorites = (sequelize) =>
  sequelize.define(
    "favorites",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idClient: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idService: {
        type: DataTypes.INTEGER,
        references: {
          model: Service(sequelize),
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "favorites",
    }
  );

module.exports = Favorites;
