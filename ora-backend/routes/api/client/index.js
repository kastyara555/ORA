var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { updateClient, clientHistory } = require("../../../controllers/clientController");

var clientRouter = express.Router();

clientRouter.post(
  "/:userTypeMapId/update",
  checkAuthorization,
  function (req, res) {
    updateClient(req, res);
  }
);

clientRouter.post(
  "/:userTypeMapId/history",
  checkAuthorization,
  function (req, res) {
    clientHistory(req, res);
  }
);

module.exports = clientRouter;
