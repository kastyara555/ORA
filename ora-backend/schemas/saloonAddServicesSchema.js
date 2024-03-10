const Joi = require("joi");

const serviceSchema = Joi.object({
  procedureId: Joi.number().required(),
  hours: Joi.number().required(),
  minutes: Joi.number().required(),
  description: Joi.string().trim().allow("").max(256).required(),
});

const saloonAddServicesSchema = Joi.object({
  services: Joi.array().items(serviceSchema).required(),
});

module.exports = {
  saloonAddServicesSchema,
};
