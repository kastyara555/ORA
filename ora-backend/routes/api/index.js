var express = require("express");

const {
  getProcedureGroups,
  getProceduresTree,
  getProceduresByGroupId,
  getProceduresByName,
} = require("../../controllers/proceduresController");
const { getCities } = require("../../controllers/locationController");

var router = express.Router();

router.get("/categories", function (req, res, next) {
  getProcedureGroups(res);
});

router.get("/proceduresTree", function (req, res, next) {
  getProceduresTree(res);
});

router.get("/procedures/:categoryId", function (req, res, next) {
  getProceduresByGroupId(req, res);
});

router.get("/searchProcedures/:search", function (req, res, next) {
  getProceduresByName(req, res);
});

router.get("/cities", function (req, res, next) {
  getCities(res);
});

module.exports = router;
