const Joi = require("joi");

const updatePasswordSchema = Joi.object({
  token: Joi.string().trim().required(),
  password: Joi.string().trim().min(5).max(32).required(),
});

module.exports = {
  updatePasswordSchema,
};
