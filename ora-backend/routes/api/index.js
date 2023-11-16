var express = require("express");

const {
  getProcedureGroups,
  getProceduresTree,
  getProceduresByGroupId,
  getProceduresByName,
} = require("../../controllers/proceduresController");
const { getCities } = require("../../controllers/locationController");
const {
  registrationSaloon,
  registrationUser,
} = require("../../controllers/registrationController");
const { loginUser } = require("../../controllers/loginController");

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

router.post("/registration/saloon", function (req, res, next) {
  registrationSaloon(req, res);
});

router.post("/registration/user", function (req, res, next) {
  registrationUser(req, res);
});

router.post("/login", function (req, res, next) {
  loginUser(req, res);
});

module.exports = router;
