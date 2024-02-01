const Joi = require("joi");

const saloonDeleteMastersSchema = Joi.object({
  codes: Joi.array().items(Joi.number()).required(),
});

module.exports = {
  saloonDeleteMastersSchema,
};
