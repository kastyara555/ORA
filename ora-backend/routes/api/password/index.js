var express = require("express");

const {
  startPasswordRestoration,
  updatePassword,
} = require("../../../controllers/passwordRestorationController");

var passwordRouter = express.Router();

passwordRouter.post("/send", function (req, res) {
  startPasswordRestoration(req, res);
});

passwordRouter.post("/update", function (req, res) {
  updatePassword(req, res);
});

module.exports = passwordRouter;
