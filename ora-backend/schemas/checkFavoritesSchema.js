const Joi = require("joi");

const checkFavoritesSchema = Joi.object({
  idClient: Joi.number().integer().positive().required(),
  idServices: Joi.array().items(Joi.number().integer().positive()).required(),
});

module.exports = {
  checkFavoritesSchema,
};
