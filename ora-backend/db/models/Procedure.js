const { DataTypes } = require("sequelize");

const Procedure = (sequelize) =>
  sequelize.define(
    "procedure",
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
    },
    {
      tableName: "procedure",
    }
  );

module.exports = Procedure;
