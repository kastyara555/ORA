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
const saloonRouter = require("./saloon");

var router = express.Router();

router.use("/saloon", saloonRouter);

router.get("/categories", function (req, res) {
  getProcedureGroups(res);
});

router.get("/proceduresTree", function (req, res) {
  getProceduresTree(res);
});

router.get("/procedures/:categoryId", function (req, res) {
  getProceduresByGroupId(req, res);
});

router.get("/searchProcedures/:search", function (req, res) {
  getProceduresByName(req, res);
});

router.get("/cities", function (req, res) {
  getCities(res);
});

router.post("/registration/saloon", function (req, res) {
  registrationSaloon(req, res);
});

router.post("/registration/user", function (req, res) {
  registrationUser(req, res);
});

router.post("/login", function (req, res) {
  loginUser(req, res);
});

router.get("/profile", checkAuthorization, function (req, res) {
  getUserData(req, res);
});

router.post("/profile/update/:userTypeMapId", checkAuthorization, function (req, res) {
  updateProfile(req, res);
});

module.exports = router;
