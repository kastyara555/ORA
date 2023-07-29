const { connection } = require("../connection");
const { categories } = require("../consts/services");
const ProcedureGroup = require("../models/ProcedureGroup");

const sequelize = connection;

const migration = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await ProcedureGroup(connection).bulkCreate(
      categories.map(({ name }) => ({ name }))
    );

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
