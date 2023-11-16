const Joi = require("joi");

const userLoginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(5).max(32).required(),
  userType: Joi.number(),
});

module.exports = {
  userLoginSchema,
};
