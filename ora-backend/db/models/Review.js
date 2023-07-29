const { DataTypes } = require("sequelize");

const ServiceInstance = require("./ServiceInstance");
const ReviewStatus = require("./ReviewStatus");

const Review = (sequelize) =>
  sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idServiceInstance: {
        type: DataTypes.INTEGER,
        references: {
          model: ServiceInstance(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idReviewStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: ReviewStatus(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "review",
    }
  );

module.exports = Review;
