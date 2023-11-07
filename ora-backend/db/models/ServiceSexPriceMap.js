const { DataTypes } = require("sequelize");

const Sex = require("./Sex");
const Service = require("./Service");

const ServiceSexPriceMap = (sequelize) =>
  sequelize.define(
    "service_sex_price_map",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idService: {
        type: DataTypes.INTEGER,
        references: {
          model: Service(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      idSex: {
        type: DataTypes.INTEGER,
        references: {
          model: Sex(sequelize),
          key: "id",
        },
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "service_sex_price_map",
    }
  );

module.exports = ServiceSexPriceMap;
