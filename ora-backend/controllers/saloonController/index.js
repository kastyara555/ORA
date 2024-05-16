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
const { updateSaloon, getSaloonBaseInfo } = require("./information");

module.exports = {
  getSaloonBaseInfo,
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
