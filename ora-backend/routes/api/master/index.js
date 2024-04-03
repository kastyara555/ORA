var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { isValidUserByType } = require("../../../middlewares/user");
const {
  updateMaster,
  timetableInformation,
  timetableAvailability,
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

module.exports = masterRouter;
