const Joi = require('joi');
const { omit } = require('lodash');

const requiredString = Joi.string().required();
const requiredNumber = Joi.string().required();
const mongoID = Joi.string().regex(/^[a-fA-F0-9]{24}$/);
const keys = (object) => Joi.object().keys(object);

const createService = keys({
  name: requiredString.min(5).max(60).description('Service name'),
  description: Joi.string(),
  icon: Joi.string(),
  images: Joi.array().items(Joi.string()),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  visible: Joi.boolean().default(true),
  tagline: Joi.string(),
  steps: Joi.array().items(Joi.string())
  //  requiredString.email().max(50).description('User\'s valid email address'),
});

const updateService = keys({
  description: Joi.string(),
  icon: Joi.string(),
  image: Joi.array().items(Joi.string()),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  visible: Joi.boolean().default(true),
  tagline: Joi.string(),
  steps: Joi.array().items(Joi.string())
  //  requiredString.email().max(50).description('User\'s valid email address'),
});

const createCategory = keys({
  name: requiredString.min(5).max(60).description('Service name'),
  description: Joi.string(),
  icon: Joi.string(),
  images: Joi.array().items(Joi.string()),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  visible: Joi.boolean().default(true),
  tagline: Joi.string(),
  steps: Joi.array().items(Joi.string()),
  service: mongoID.required(),
  //  requiredString.email().max(50).description('User\'s valid email address'),
});

const updateCategory = keys({
  description: Joi.string(),
  icon: Joi.string(),
  image: Joi.array().items(Joi.string()),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  visible: Joi.boolean().default(true),

  tagline: Joi.string(),
  steps: Joi.array().items(Joi.string())
  //  requiredString.email().max(50).description('User\'s valid email address'),
});

const createItem = keys({
  name: requiredString.min(2),
  icon: Joi.string(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default('ACTIVE'),
  visible: Joi.boolean().default(true),
  class: Joi.string(),
})

const addItemToCategory = keys({
  item: mongoID.required(),
  price: Joi.number(),
  min_quantity: Joi.number().default(0),
  maximum_quantity: Joi.number().default(0),
})

const removeItemFromCategory = keys({
  item: mongoID.required(),
})

module.exports = { createService, updateService, createCategory, updateCategory, createItem, addItemToCategory, removeItemFromCategory };
