const { connection } = require("../../db/connection");
const City = require("../../db/models/City");

const getCities = async (req, res) => {
  try {
    const cities = await City(connection).findAll({
      order: [
        ["priority", "DESC"],
        ["name", "ASC"],
      ],
    });

    res.send(Object.values(cities));
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getCities,
};
