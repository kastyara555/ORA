var express = require("express");

const {
  getProcedureGroups,
  getProceduresTree,
  getProceduresByGroupId,
  getProceduresByName,
} = require("../../controllers/proceduresController");
const { getCities } = require("../../controllers/locationController");
const { loginUser } = require("../../controllers/loginController");
const { getUserData } = require("../../controllers/userController");
const { checkAuthorization } = require("../../middlewares/auth");
const clientRouter = require("./client");
const saloonRouter = require("./saloon");
const masterRouter = require("./master");
const registrationRouter = require("./registration");

var router = express.Router();

router.use("/client", clientRouter);
router.use("/saloon", saloonRouter);
router.use("/master", masterRouter);
router.use("/registration", registrationRouter);

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

router.post("/login", function (req, res) {
  loginUser(req, res);
});

router.get("/profile", checkAuthorization, function (req, res) {
  getUserData(req, res);
});

module.exports = router;
