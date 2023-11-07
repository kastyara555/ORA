const { DataTypes } = require("sequelize");

const User = require("./User");
const UserType = require("./UserType");
const UserStatus = require("./UserStatus");

const UserTypeMap = (sequelize) =>
  sequelize.define(
    "user_type_map",
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
      idUserType: {
        type: DataTypes.INTEGER,
        references: {
          model: UserType(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idUserStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: UserStatus(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      hash: {
        type: DataTypes.STRING,
      },
      bonusCount: {
        type: DataTypes.INTEGER,
      }
    },
    {
      tableName: "user_type_map",
    }
  );

module.exports = UserTypeMap;
