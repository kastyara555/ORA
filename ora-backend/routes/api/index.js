var express = require('express');

const { getProcedureGroups } = require('../../controllers/proceduresController');
const { getProceduresByGroupId } = require('../../controllers/servicesController');

var router = express.Router();

router.get('/categories', function(req, res, next) {
  getProcedureGroups(res);
});

router.get('/services/:categoryId', function(req, res, next) {
  getProceduresByGroupId(req, res);
});

module.exports = router;
