const Joi = require("joi");

const procedureAvailableDatesBySaloonSchema = Joi.object({
  year: Joi.number().min(2024).max(2100).integer().required(),
  month: Joi.number().min(1).max(12).integer().required(),
});

module.exports = {
  procedureAvailableDatesBySaloonSchema,
};
