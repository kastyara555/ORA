var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { isValidUserByType } = require("../../../middlewares/user");
const {
  updateMaster,
  timetableInformation,
  timetableAvailability,
  getServicesBySaloon,
  createServiceInstance,
  cancelServiceInstance,
} = require("../../../controllers/masterController");
const { roles } = require("../../../db/consts/roles");

var masterRouter = express.Router();

const isValidMaster = isValidUserByType(roles.master.name);

masterRouter.post(
  "/:userTypeMapId/update",
  checkAuthorization,
  isValidMaster,
  function (req, res) {
    updateMaster(req, res);
  }
);

masterRouter.get(
  "/:userTypeMapId/check-timetable-availability",
  checkAuthorization,
  isValidMaster,
  function (req, res) {
    timetableAvailability(req, res);
  }
);

masterRouter.get(
  "/:userTypeMapId/timetable/:date",
  checkAuthorization,
  isValidMaster,
  function (req, res) {
    timetableInformation(req, res);
  }
);

masterRouter.get(
  "/:userTypeMapId/services/:idSaloon",
  checkAuthorization,
  isValidMaster,
  function (req, res) {
    getServicesBySaloon(req, res);
  }
);

masterRouter.post(
  "/:userTypeMapId/services",
  checkAuthorization,
  isValidMaster,
  function (req, res) {
    createServiceInstance(req, res);
  }
);

masterRouter.post(
  "/:userTypeMapId/services/:serviceInstanceId/cancel",
  checkAuthorization,
  isValidMaster,
  function (req, res) {
    cancelServiceInstance(req, res);
  }
);

module.exports = masterRouter;
