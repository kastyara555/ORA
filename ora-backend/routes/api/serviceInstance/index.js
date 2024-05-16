var express = require("express");

const {
  getAvailableDatesForProcedureBySaloon,
  getAvailableMastersForProcedureBySaloonAndDate,
  getAvailableRecordsForProcedureBySaloonDateAndMaster,
} = require("../../../controllers/serviceInstanceController");

var serviceInstanceRouter = express.Router();

serviceInstanceRouter.post(
  "/:saloonId/:procedureId/availableDates",
  function (req, res) {
    getAvailableDatesForProcedureBySaloon(req, res);
  }
);

serviceInstanceRouter.post(
  "/:saloonId/:procedureId/availableMasters",
  function (req, res) {
    getAvailableMastersForProcedureBySaloonAndDate(req, res);
  }
);

serviceInstanceRouter.post(
  "/:saloonId/:procedureId/availableRecords",
  function (req, res) {
    getAvailableRecordsForProcedureBySaloonDateAndMaster(req, res);
  }
);

module.exports = serviceInstanceRouter;
