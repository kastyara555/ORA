const { DataTypes } = require("sequelize");

const UserTypeMap = require("./UserTypeMap");

const MasterInfo = (sequelize) =>
  sequelize.define(
    "master_info",
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
      description: {
        type: DataTypes.JSON,
      },
    },
    {
      tableName: "master_info",
    }
  );

module.exports = MasterInfo;
