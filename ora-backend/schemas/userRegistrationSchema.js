const Joi = require("joi");

const userRegistrationSchema = Joi.object({
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
  lastName: Joi.string().trim().min(2).max(32).required(),
  password: Joi.string().min(5).max(32).required(),
  birthday: Joi.string().max(32).required(),
  sex: Joi.number().min(1).max(2).required(),
  agree: Joi.boolean().required(),
});

module.exports = {
  userRegistrationSchema,
};
