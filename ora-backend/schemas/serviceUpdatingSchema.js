const Joi = require("joi");

const serviceUpdatingSchema = Joi.object({
  description: Joi.string().trim().allow("").max(256).required(),
});

module.exports = {
  serviceUpdatingSchema,
};
