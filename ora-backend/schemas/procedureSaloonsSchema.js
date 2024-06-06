const Joi = require("joi");

const procedureSaloonsSchema = Joi.object({
  pageNumber: Joi.number().min(1).integer().required(),
  pageSize: Joi.number().min(1).max(64).integer().required(),
});

module.exports = {
  procedureSaloonsSchema,
};
