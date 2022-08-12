const Joi = require("joi");

const validators = {
  listingValidator: Joi.object({
    yelpID: Joi.string().required(),
    avgRating: Joi.number().min(0).max(5).required(),
    reviewCount: Joi.number(),
  }),
};

module.exports = validators;