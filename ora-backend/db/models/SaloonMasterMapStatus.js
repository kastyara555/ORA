const { DataTypes } = require("sequelize");

const SaloonMasterMapStatus = (sequelize) =>
  sequelize.define(
    "saloon_master_map_status",
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
      tableName: "saloon_master_map_status",
    }
  );

module.exports = SaloonMasterMapStatus;
