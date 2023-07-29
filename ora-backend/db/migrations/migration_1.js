const { connection } = require("../connection");
const { cities } = require("../consts/cities");
const City = require("../models/City");

const sequelize = connection;

const migration = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await City(connection).bulkCreate(cities);

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
