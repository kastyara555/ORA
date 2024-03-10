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
const {
  getSaloonServiceInfo,
  updateService,
  addServiceMasters,
  removeServiceMasters,
  updateServiceMaster,
} = require("./serviceDetails");
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
  updateService,
  addServiceMasters,
  removeServiceMasters,
  updateServiceMaster,
};
