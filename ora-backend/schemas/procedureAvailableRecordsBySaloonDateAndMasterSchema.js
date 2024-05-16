const Joi = require("joi");

const procedureAvailableRecordsBySaloonDateAndMasterSchema = Joi.object({
  date: Joi.string().min(10).max(10).required(),
  masterId: Joi.number().positive().integer().required(),
});

module.exports = {
  procedureAvailableRecordsBySaloonDateAndMasterSchema,
};
