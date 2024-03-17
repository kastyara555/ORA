const { DataTypes } = require("sequelize");

const PasswordRestorationStatus = (sequelize) =>
  sequelize.define(
    "password_restoration_status",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "password_restoration_status",
    }
  );

module.exports = PasswordRestorationStatus;
