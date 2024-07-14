const Joi = require("joi");

const favoritesSchema = Joi.object({
  idService: Joi.number().integer().positive().required(),
});

module.exports = {
  favoritesSchema,
};
