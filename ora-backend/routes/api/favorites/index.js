var express = require("express");

const { checkAuthorization } = require("../../../middlewares/auth");
const { saveFavorites, clearFavorites, checkFavorites } = require("../../../controllers/favoritesController");

var favoritesRouter = express.Router();

favoritesRouter.post(
  "/save",
  checkAuthorization,
  function (req, res) {
    saveFavorites(req, res);
  }
);

favoritesRouter.post(
  "/clear",
  checkAuthorization,
  function (req, res) {
    clearFavorites(req, res);
  }
);

favoritesRouter.post(
  "/checkSaloons",
  function (req, res) {
    checkFavorites(req, res);
  }
);

module.exports = favoritesRouter;
