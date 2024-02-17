const {
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
} = require("./master");
const {
  getSaloonServices,
  deleteSaloonServices,
  addSaloonServices,
} = require("./service");
const { getSaloonServiceInfo } = require("./serviceDetails");
const { updateSaloon } = require("./information");

module.exports = {
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
  getSaloonServices,
  deleteSaloonServices,
  addSaloonServices,
  updateSaloon,
  getSaloonServiceInfo,
};
