var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const {
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
  getSaloonServices,
  deleteSaloonServices,
  addSaloonServices,
  updateSaloon,
  getSaloonServiceInfo,
} = require("../../../controllers/saloonController");

var saloonRouter = express.Router();

saloonRouter.post(
  "/:userTypeMapId/update",
  checkAuthorization,
  function (req, res) {
    updateSaloon(req, res);
  }
);

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

saloonRouter.post(
  "/:userTypeMapId/services/get",
  checkAuthorization,
  function (req, res) {
    getSaloonServices(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/delete",
  checkAuthorization,
  function (req, res) {
    deleteSaloonServices(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/add",
  checkAuthorization,
  function (req, res) {
    addSaloonServices(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/:serviceId",
  checkAuthorization,
  function (req, res) {
    getSaloonServiceInfo(req, res);
  }
);

module.exports = saloonRouter;
