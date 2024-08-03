const { connection } = require("../../db/connection");
const City = require("../../db/models/City");
const StreetType = require("../../db/models/StreetType");

const getCities = async (req, res) => {
  try {
    const cities = await City(connection).findAll({
      order: [
        ["priority", "DESC"],
        ["name", "ASC"],
      ],
    });

    return res.send(Object.values(cities));
  } catch (e) {
    return res.status(500).send();
  }
};

const getStreetTypes = async (req, res) => {
  try {
    const streetTypes = await StreetType(connection).findAll();

    return res.send(Object.values(streetTypes));
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getCities,
  getStreetTypes,
};
