const { DataTypes } = require("sequelize");

const UserType = (sequelize) =>
  sequelize.define(
    "user_type",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissionCreateSaloon: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionCreateModerator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionCreateService: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionCreateServiceInstance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionRemoveClient: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionRemoveMaster: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionRemoveSaloon: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionRemoveModerator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionRemoveService: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionRemoveServiceInstance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionEditClient: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionEditMaster: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionEditSaloon: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionEditModerator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionEditService: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      permissionEditServiceInstance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "user_type",
    }
  );

module.exports = UserType;
