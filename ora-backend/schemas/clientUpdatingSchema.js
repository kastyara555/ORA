const Joi = require("joi");

const pictureSchema = Joi.object({
  data: Joi.string().max(3000000).required(),
  fileName: Joi.string().required(),
  fileSize: Joi.number().min(0).max(3000000).required(),
  fileType: Joi.string().required(),
}).allow(null);

const clientUpdatingSchema = Joi.object({
  mainImage: pictureSchema,
  lastName: Joi.string().trim().min(2).max(32).required(),
});

module.exports = {
  clientUpdatingSchema,
};
