var express = require("express");

const {
  getAvailableDatesForProcedureBySaloon,
  getAvailableMastersForProcedureBySaloonAndDate,
  getAvailableRecordsForProcedureBySaloonDateAndMaster,
  bookServiceInstance,
  loginBookServiceInstance,
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

serviceInstanceRouter.post(
  "/book",
  function (req, res) {
    bookServiceInstance(req, res);
  }
);

serviceInstanceRouter.post(
  "/login-book",
  function (req, res) {
    loginBookServiceInstance(req, res);
  }
);

module.exports = serviceInstanceRouter;
