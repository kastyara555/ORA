const Joi = require("joi");

const masterRegistrationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .trim()
    .min(12)
    .max(12)
    .pattern(/^[0-9]+$/)
    .required(),
  name: Joi.string().trim().min(2).max(32).required(),
  password: Joi.string().min(5).max(32).required(),
  description: Joi.string().trim().allow("").max(256).required(),
  relatedSaloonMapId: Joi.number(),
});

module.exports = {
  masterRegistrationSchema,
};

