const {
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
} = require("./master");
const {
  getSaloonServices,
  addSaloonServices,
} = require("./service");
const {
  getSaloonServiceInfo,
  updateService,
  addServiceMasters,
  removeServiceMasters,
  updateServiceMaster,
} = require("./serviceDetails");
const {
  updateSaloon,
  getSaloonBaseInfo,
  getSaloonBaseServices,
  getSaloonTimetable,
} = require("./information");

module.exports = {
  getSaloonBaseInfo,
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
  getSaloonServices,
  addSaloonServices,
  updateSaloon,
  getSaloonServiceInfo,
  updateService,
  addServiceMasters,
  removeServiceMasters,
  updateServiceMaster,
  getSaloonBaseServices,
  getSaloonTimetable,
};
