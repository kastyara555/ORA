const { DataTypes } = require("sequelize");

const PasswordRestorationStatus = require("./PasswordRestorationStatus");

const PasswordRestoration = (sequelize) =>
  sequelize.define(
    "password_restoration",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idPasswordRestorationStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: PasswordRestorationStatus(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "password_restoration",
    }
  );

module.exports = PasswordRestoration;
