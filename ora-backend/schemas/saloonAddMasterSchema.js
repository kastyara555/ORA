const Joi = require("joi");

const saloonAddMasterSchema = Joi.object({
  code: Joi.number().positive().required(),
});

module.exports = {
  saloonAddMasterSchema,
};
