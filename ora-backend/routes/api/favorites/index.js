var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { saveFavorites, clearFavorites } = require("../../../controllers/favoritesController");

var favoritesRouter = express.Router();

favoritesRouter.post(
  "/:userTypeMapId/save",
  checkAuthorization,
  function (req, res) {
    saveFavorites(req, res);
  }
);

favoritesRouter.post(
  "/:userTypeMapId/clear",
  checkAuthorization,
  function (req, res) {
    clearFavorites(req, res);
  }
);

module.exports = favoritesRouter;
