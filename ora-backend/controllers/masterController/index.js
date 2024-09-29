const { updateMaster } = require("./information");
const { timetableInformation } = require("./timetable");
const {
  getServicesBySaloon,
  createServiceInstance,
  cancelServiceInstance,
} = require("./service");

module.exports = {
  updateMaster,
  timetableInformation,
  getServicesBySaloon,
  createServiceInstance,
  cancelServiceInstance,
};
