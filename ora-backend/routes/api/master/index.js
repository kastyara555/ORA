var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { updateMaster } = require("../../../controllers/masterController");

var masterRouter = express.Router();

masterRouter.post(
  "/:userTypeMapId/update",
  checkAuthorization,
  function (req, res) {
    updateMaster(req, res);
  }
);

module.exports = masterRouter;
