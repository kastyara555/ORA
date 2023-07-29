const { DataTypes } = require("sequelize");

const ReviewStatus = (sequelize) =>
  sequelize.define(
    "review_status",
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
      tableName: "review_status",
    }
  );

module.exports = ReviewStatus;
