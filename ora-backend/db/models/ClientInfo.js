const { DataTypes } = require("sequelize");

const Sex = require("./Sex");
const UserTypeMap = require("./UserTypeMap");

const ClientInfo = (sequelize) =>
  sequelize.define(
    "client_info",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idUserTypeMap: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idSex: {
        type: DataTypes.INTEGER,
        references: {
          model: Sex(sequelize),
          key: "id",
        },
      },
      lastName: {
        type: DataTypes.STRING,
      },
      birthday: {
        type: DataTypes.STRING,
      },
      agree: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "client_info",
    }
  );

module.exports = ClientInfo;
