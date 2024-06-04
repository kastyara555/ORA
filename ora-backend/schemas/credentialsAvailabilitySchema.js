const Joi = require("joi");

const credentialsAvailabilitySchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } }),
  phone: Joi.string()
    .trim()
    .min(12)
    .max(12)
    .pattern(/^[0-9]+$/),
});

module.exports = {
  credentialsAvailabilitySchema,
};
