const { updateMaster } = require("./information");
const { timetableAvailability, timetableInformation } = require("./timetable");
const {
  getServicesBySaloon,
  createServiceInstance,
  cancelServiceInstance,
} = require("./service");

module.exports = {
  updateMaster,
  timetableInformation,
  timetableAvailability,
  getServicesBySaloon,
  createServiceInstance,
  cancelServiceInstance,
};
