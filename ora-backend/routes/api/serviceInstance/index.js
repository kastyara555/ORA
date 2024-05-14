var express = require("express");

const {
  getAvailableDatesForProcedureBySaloon,
} = require("../../../controllers/serviceInstanceController");

var serviceInstanceRouter = express.Router();

serviceInstanceRouter.post(
  "/:saloonId/:procedureId/availableDates",
  function (req, res) {
    getAvailableDatesForProcedureBySaloon(req, res);
  }
);

module.exports = serviceInstanceRouter;
