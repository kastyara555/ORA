const { DataTypes } = require("sequelize");
const UserTypeMap = require("./UserTypeMap");

const UserImage = (sequelize) =>
  sequelize.define(
    "user_image",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idUserTypeMap: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
      },
      isMain: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "user_image",
    }
  );

module.exports = UserImage;
