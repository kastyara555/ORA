const Joi = require("joi");

const serviceMastersRemovingSchema = Joi.object({
  codes: Joi.array().items(Joi.number()).required(),
});

module.exports = {
  serviceMastersRemovingSchema,
};
