const { DataTypes } = require("sequelize");

const SaloonMasterMapStatus = require("./SaloonMasterMapStatus");
const UserTypeMap = require("./UserTypeMap");

const SaloonMasterMap = (sequelize) =>
  sequelize.define(
    "saloon_master_map",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idSaloon: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idMaster: {
        type: DataTypes.INTEGER,
        references: {
          model: UserTypeMap(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idSaloonMasterMapStatus: {
        type: DataTypes.INTEGER,
        references: {
          model: SaloonMasterMapStatus(sequelize),
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      tableName: "saloon_master_map",
    }
  );

module.exports = SaloonMasterMap;
