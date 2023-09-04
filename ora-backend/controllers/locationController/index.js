const { connection } = require("../../db/connection");
const City = require("../../db/models/City");

const getCities = async (res) => {
  const cities = await City(connection).findAll({
    order: [["priority", "DESC"], ["name", "ASC"]],
  });

  res.send(Object.values(cities));
};

module.exports = {
  getCities,
};
