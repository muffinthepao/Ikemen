const yelpAPI = require("../../source/yelp_api");
const yelpAPIBase = "https://api.yelp.com/v3/businesses";

const reviewModel = require('../../models/reviews/reviews')
const listingModel = require('../../models/listings/listings')

const reviewsValidator = require('../validators/reviews')
const listingsValidator = require('../validators/listings')

const controller = {
  submitReview: async (req, res) => {
    const listingID = req.params.listing_id;
    let errorObject = {}

    //Joi validation
    const reviewValidationResults = reviewsValidator.reviewValidator.validate(req.body, {abortEarly: false})

    if(reviewValidationResults.error) {

      const validationError = reviewValidationResults.error.details
      validationError.forEach(errorMessage => {
        errorObject[errorMessage.context.key] = errorMessage.message
      })

      const listingID = req.params.listing_id;
      const listingCall = `${yelpAPIBase}/${listingID}`;

      //Individual Listing
      const listing = await yelpAPI(listingCall);
      const listingLocation = listing.location;

      //Individual Listing Reviews. Max of 3 reviews. Yelp API limitation. 
      const listingReviews = await yelpAPI(`${listingCall}/reviews`)
      const allListingReviews = listingReviews.reviews


      res.render("./pages/listing.ejs", {
        listing,
        listingID,
        listingLocation,
        allListingReviews,
        errorObject
      });
    }

    const reviewValidated = reviewValidationResults.value

    //create review document in db
  },
};

module.exports = controller;