var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { isValidUserByType } = require("../../../middlewares/user");
const {
  getSaloonBaseInfo,
  getSaloonMasters,
  deleteSaloonMasters,
  addSaloonMaster,
  getSaloonServices,
  addSaloonServices,
  updateSaloon,
  getSaloonServiceInfo,
  updateService,
  addServiceMasters,
  removeServiceMasters,
  updateServiceMaster,
} = require("../../../controllers/saloonController");
const { roles } = require("../../../db/consts/roles");

var saloonRouter = express.Router();

const isValidSaloon = isValidUserByType(roles.saloon.name);

saloonRouter.get("/:userTypeMapId", function (req, res) {
  getSaloonBaseInfo(req, res);
});

saloonRouter.post(
  "/:userTypeMapId/update",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    updateSaloon(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/masters/get",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    getSaloonMasters(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/masters/delete",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    deleteSaloonMasters(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/masters/add",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    addSaloonMaster(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/get",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    getSaloonServices(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/add",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    addSaloonServices(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/:serviceId",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    getSaloonServiceInfo(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/:serviceId/update",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    updateService(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/:serviceId/addMasters",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    addServiceMasters(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/:serviceId/removeMasters",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    removeServiceMasters(req, res);
  }
);

saloonRouter.post(
  "/:userTypeMapId/services/:serviceId/updateMaster",
  checkAuthorization,
  isValidSaloon,
  function (req, res) {
    updateServiceMaster(req, res);
  }
);

module.exports = saloonRouter;
