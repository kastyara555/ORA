var express = require("express");
const {
  getProcedureData,
} = require("../../../controllers/procedureController");

var procedureRouter = express.Router();

procedureRouter.post("/:procedureId", function (req, res) {
  getProcedureData(req, res);
});

module.exports = procedureRouter;
