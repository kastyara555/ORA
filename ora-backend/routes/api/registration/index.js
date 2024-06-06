var express = require("express");
const {
  registrationSaloon,
  registrationUser,
  registrationMaster,
  checkCredentialsAvailability,
} = require("../../../controllers/registrationController");

var registrationRouter = express.Router();

registrationRouter.post("/saloon", function (req, res) {
  registrationSaloon(req, res);
});

registrationRouter.post("/user", function (req, res) {
  registrationUser(req, res);
});

registrationRouter.post("/master", function (req, res) {
  registrationMaster(req, res);
});

registrationRouter.post("/check-credentials-availability", function (req, res) {
  checkCredentialsAvailability(req, res);
});

module.exports = registrationRouter;
