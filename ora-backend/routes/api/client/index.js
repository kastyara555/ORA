var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { updateClient } = require("../../../controllers/clientController");

var clientRouter = express.Router();

clientRouter.post(
  "/:userTypeMapId/update",
  checkAuthorization,
  function (req, res) {
    updateClient(req, res);
  }
);

module.exports = clientRouter;
