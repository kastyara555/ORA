const { DataTypes } = require("sequelize");

const UserStatus = require("./UserStatus");
const UserType = require("./UserType");

const User = (sequelize) =>
  sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idUserStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: UserStatus(sequelize),
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      surname: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "user",
    }
  );

module.exports = User;
