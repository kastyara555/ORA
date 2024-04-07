const Joi = require("joi");

const masterCreateServiceInstanceSchema = Joi.object({
  id: Joi.number(),
  date: Joi.string().min(10).max(10),
  hours: Joi.number().min(0).max(23),
  minutes: Joi.number().min(0).max(59),
});

module.exports = {
  masterCreateServiceInstanceSchema,
};
