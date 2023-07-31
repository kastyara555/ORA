const { DataTypes } = require("sequelize");

const User = require("./User");

const ServiceRating = (sequelize) =>
  sequelize.define(
    "service_rating",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idSaloon: {
        type: DataTypes.INTEGER,
        references: {
          model: User(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      reviewsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reviewsAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "service_rating",
    }
  );

module.exports = ServiceRating;
