var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const {
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
} = require("../../../controllers/saloonController");

var saloonRouter = express.Router();

saloonRouter.post(
  "/:userTypeMapId/masters/get",
  checkAuthorization,
  function (req, res) {
    getSaloonMasters(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/masters/delete",
  checkAuthorization,
  function (req, res) {
    deleteSaloonMasters(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/masters/add",
  checkAuthorization,
  function (req, res) {
    addSaloonMaster(req, res);
  }
);

module.exports = saloonRouter;
