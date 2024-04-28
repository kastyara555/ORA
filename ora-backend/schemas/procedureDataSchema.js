const Joi = require("joi");

const procedureDataSchema = Joi.object({
  date: Joi.string().min(10).max(10).allow(null),
  cityId: Joi.number().min(1).allow(null),
});

module.exports = {
  procedureDataSchema,
};
