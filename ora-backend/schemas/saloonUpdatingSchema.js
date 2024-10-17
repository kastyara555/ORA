const Joi = require("joi");

const pictureSchema = Joi.object({
  data: Joi.string().max(4500000).required(),
  fileName: Joi.string().required(),
  fileSize: Joi.number().min(0).max(4500000).required(),
  fileType: Joi.string().required(),
}).allow(null);

const saloonUpdatingSchema = Joi.object({
  mainImage: pictureSchema,
  description: Joi.string().trim().allow("").max(256).required(),
});

module.exports = {
  saloonUpdatingSchema,
};
