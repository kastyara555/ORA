const { DataTypes } = require("sequelize");

const User = require("./User");

const UserRating = (sequelize) =>
  sequelize.define(
    "user_rating",
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
      tableName: "user_rating",
    }
  );

module.exports = UserRating;
