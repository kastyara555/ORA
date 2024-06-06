const Joi = require("joi");

const procedureAvailableMastersBySaloonAndDateSchema = Joi.object({
  date: Joi.string().min(10).max(10).required(),
});

module.exports = {
  procedureAvailableMastersBySaloonAndDateSchema,
};
