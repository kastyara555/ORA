var express = require("express");
const {
  getProcedureData,
  getProcedureCities,
} = require("../../../controllers/procedureController");

var procedureRouter = express.Router();

procedureRouter.post("/:procedureId", function (req, res) {
  getProcedureData(req, res);
});

procedureRouter.get("/:procedureId/cities", function (req, res) {
  getProcedureCities(req, res);
});

module.exports = procedureRouter;
