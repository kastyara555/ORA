const Joi = require("joi");

const getFavoritesSchema = Joi.object({
  idClient: Joi.number().integer().positive().required(),
});

module.exports = {
  getFavoritesSchema,
};
