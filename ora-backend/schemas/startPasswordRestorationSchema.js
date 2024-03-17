const Joi = require("joi");

const startPasswordRestorationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
});

module.exports = {
  startPasswordRestorationSchema,
};
