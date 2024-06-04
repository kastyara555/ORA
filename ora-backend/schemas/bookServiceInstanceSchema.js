const Joi = require("joi");

const bookServiceInstanceSchema = Joi.object({
    serviceInstanceId: Joi.number().positive().integer().required(),
    clientUserTypeMapId: Joi.number().positive().integer().required(),
    comment: Joi.string().min(0).max(256).required(),
});

module.exports = {
    bookServiceInstanceSchema,
};
