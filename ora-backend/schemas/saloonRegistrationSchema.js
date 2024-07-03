const Joi = require("joi");

const emailFormSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
});

const aboutFormSchema = Joi.object({
  saloonName: Joi.string().trim().min(1).max(32).required(),
  description: Joi.string().trim().allow("").max(256).required(),
  name: Joi.string().trim().min(2).max(32).required(),
  phone: Joi.string()
    .trim()
    .min(12)
    .max(12)
    .pattern(/^[0-9]+$/)
    .required(),
});

const passwordFormSchema = Joi.object({
  password: Joi.string().trim().min(5).max(32).required(),
});

const adressTypeFormSchema = Joi.object({
  hasAdress: Joi.boolean().required(),
});

const adressFormSchema = Joi.object({
  city: Joi.number().required(),
  streetType: Joi.number().required(),
  street: Joi.string().allow("").trim().max(32),
  building: Joi.string()
    .allow("")
    .trim()
    .max(3)
    .pattern(/^[0-9]+$/),
  stage: Joi.string()
    .allow("")
    .trim()
    .max(3)
    .pattern(/^[0-9]+$/),
  office: Joi.string()
    .allow("")
    .trim()
    .max(3)
    .pattern(/^[0-9]+$/),
});

const stuffCountFormSchema = Joi.object({
  count: Joi.number().min(1).max(7).required(),
});

const visitPaymentFormSchema = Joi.object({
  payment: Joi.number().min(0).max(100),
});

const timeFormSchema = Joi.object({
  timeLine: Joi.string().required(),
});

const servicesFormSchema = Joi.object({
  services: Joi.array().required(),
});

const pictureSchema = Joi.object({
  data: Joi.string().max(3000000).required(),
  fileName: Joi.string().required(),
  fileSize: Joi.number().min(0).max(3000000).required(),
  fileType: Joi.string().required(),
});

const picturesFormSchema = Joi.object({
  pictures: Joi.array().items(pictureSchema).required(),
});

const saloonRegistrationSchema = Joi.object({
  emailForm: emailFormSchema,
  aboutForm: aboutFormSchema,
  passwordForm: passwordFormSchema,
  adressTypeForm: adressTypeFormSchema,
  adressForm: adressFormSchema,
  stuffCountForm: stuffCountFormSchema,
  visitPaymentForm: visitPaymentFormSchema,
  timeForm: timeFormSchema,
  servicesForm: servicesFormSchema,
  picturesForm: picturesFormSchema,
});

module.exports = {
  saloonRegistrationSchema,
};
