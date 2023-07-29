const { Sequelize } = require("sequelize");

const connection = new Sequelize(
  "ora_database",
  "root",
  "12345678",
  {
    host: "localhost",
    dialect: "mysql",
  },
  {
    define: {
      freezeTableName: true,
    },
  }
);

module.exports = {
    connection,
};
