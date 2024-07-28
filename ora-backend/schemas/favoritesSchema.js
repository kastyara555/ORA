const Joi = require("joi");

const favoritesSchema = Joi.object({
  idClient: Joi.number().integer().positive().required(),
  idService: Joi.number().integer().positive().required(),
});

module.exports = {
  favoritesSchema,
};
