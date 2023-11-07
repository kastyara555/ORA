const { connection } = require("../connection");
const { cities } = require("../consts/cities");
const { roles } = require("../consts/roles");
const { categories } = require("../consts/categories");
const { sexes } = require("../consts/sexes");
const { userStatuses } = require("../consts/userStatuses");
const City = require("../models/City");
const Sex = require("../models/Sex");
const UserType = require("../models/UserType");
const UserStatus = require("../models/UserStatus");
const ProcedureGroup = require("../models/ProcedureGroup");

const sequelize = connection;

const migration = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await City(connection).bulkCreate(cities);
    await Sex(connection).bulkCreate(Object.values(sexes));
    await UserType(connection).bulkCreate(Object.values(roles));
    await UserStatus(connection).bulkCreate(Object.values(userStatuses));
    await ProcedureGroup(connection).bulkCreate(Object.values(categories));

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
