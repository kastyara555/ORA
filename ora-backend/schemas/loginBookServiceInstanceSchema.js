const Joi = require("joi");

const loginBookServiceInstanceSchema = Joi.object({
  serviceInstanceId: Joi.number().positive().integer().required(),
  comment: Joi.string().min(0).max(256).required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(5).max(32).required(),
});

module.exports = {
  loginBookServiceInstanceSchema,
};
