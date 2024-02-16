const Joi = require("joi");

const saloonDeleteServicesSchema = Joi.object({
  codes: Joi.array().items(Joi.number()).required(),
});

module.exports = {
  saloonDeleteServicesSchema,
};
