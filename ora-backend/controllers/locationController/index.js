const { connection } = require("../../db/connection");

const getCities = async (req, res) => {
  try {
    const cities = await connection.models.city.findAll({
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
    const streetTypes = await connection.models.street_type.findAll();

    return res.send(Object.values(streetTypes));
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getCities,
  getStreetTypes,
};
