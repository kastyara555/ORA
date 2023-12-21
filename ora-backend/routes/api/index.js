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
const { getUserData, updateProfile } = require("../../controllers/userController");
const { checkAuthorization } = require("../../middlewares/auth");

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

router.get("/profile", checkAuthorization, function (req, res, next) {
  getUserData(req, res);
});

router.post("/profile/update/:userTypeMapId", checkAuthorization, function (req, res, next) {
  updateProfile(req, res);
});

module.exports = router;
