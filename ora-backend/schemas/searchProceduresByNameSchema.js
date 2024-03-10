const Joi = require("joi");

const searchProceduresByNameSchema = Joi.object({
  pageSize: Joi.number().optional().integer().min(1).max(60),
});

module.exports = {
  searchProceduresByNameSchema,
};
