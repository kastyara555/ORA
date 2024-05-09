var express = require("express");
const {
  getProcedureDataByCity,
  getProcedureCities,
} = require("../../../controllers/procedureController");

var procedureRouter = express.Router();

procedureRouter.get("/:procedureId/cities/:cityId", function (req, res) {
  getProcedureDataByCity(req, res);
});

procedureRouter.get("/:procedureId/cities", function (req, res) {
  getProcedureCities(req, res);
});

module.exports = procedureRouter;
