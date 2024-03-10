const Joi = require("joi");

const masterSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
});

const serviceMastersAddingSchema = Joi.object({
  masters: Joi.array().items(masterSchema).required(),
});

module.exports = {
  serviceMastersAddingSchema,
};
