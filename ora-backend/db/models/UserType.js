const { DataTypes } = require("sequelize");

const UserType = (sequelize) =>
  sequelize.define(
    "user_type",
    {
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
      tableName: "user_type",
    }
  );

module.exports = UserType;
