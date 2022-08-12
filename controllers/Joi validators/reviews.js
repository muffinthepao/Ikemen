const Joi = require("joi");

const validators = {
  reviewValidator: Joi.object({
    content: Joi.string().min(3).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
  }),
};

module.exports = validators;