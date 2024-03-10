const Joi = require("joi");

const masterSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  price: Joi.number().positive().required(),
});

const serviceMasterUpdatingSchema = Joi.object({
  master: masterSchema,
});

module.exports = {
  serviceMasterUpdatingSchema,
};
