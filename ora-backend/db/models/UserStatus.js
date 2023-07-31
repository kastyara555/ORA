const { DataTypes } = require("sequelize");

const UserStatus = (sequelize) =>
  sequelize.define(
    "user_status",
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
      tableName: "user_status",
    }
  );

module.exports = UserStatus;
