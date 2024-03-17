var express = require("express");

const {
  getProcedureGroups,
  getProceduresTree,
  getProceduresByGroupId,
  getProceduresByName,
} = require("../../controllers/proceduresController");
const {
  getCities,
  getStreetTypes,
} = require("../../controllers/locationController");
const { loginUser } = require("../../controllers/loginController");
const { getUserData } = require("../../controllers/userController");
const { checkAuthorization } = require("../../middlewares/auth");
const clientRouter = require("./client");
const saloonRouter = require("./saloon");
const masterRouter = require("./master");
const registrationRouter = require("./registration");
const passwordRouter = require("./password");
const { cache } = require("../../middlewares/cache");

var router = express.Router();

router.use("/client", clientRouter);
router.use("/saloon", saloonRouter);
router.use("/master", masterRouter);
router.use("/password", passwordRouter);
router.use("/registration", registrationRouter);

router.get("/categories", function (req, res) {
  getProcedureGroups(req, res);
});

router.get("/proceduresTree", function (req, res) {
  getProceduresTree(req, res);
});

router.get("/procedures/:categoryId", function (req, res) {
  getProceduresByGroupId(req, res);
});

router.post("/searchProcedures/:search", function (req, res) {
  getProceduresByName(req, res);
});

router.get("/cities", cache(600), function (req, res) {
  getCities(req, res);
});

router.get("/streetTypes", cache(600), function (req, res) {
  getStreetTypes(req, res);
});

router.post("/login", function (req, res) {
  loginUser(req, res);
});

router.get("/profile", checkAuthorization, function (req, res) {
  getUserData(req, res);
});

module.exports = router;
