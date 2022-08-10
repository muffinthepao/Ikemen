const yelpAPI = require("../../source/yelp_api");
const yelpAPIBase = "https://api.yelp.com/v3/businesses";
const mongoose = require("mongoose");

const userModel = require("../../models/authentication/users");
const listingModel = require("../../models/listings/listings");
const reviewModel = require("../../models/reviews/reviews");

const listingsValidator = require("../validators/listings");
const reviewsValidator = require("../validators/reviews");

const controller = {
  submitReview: async (req, res) => {
    const listingID = req.params.listing_id;
    let errorObject = {};

    //Joi validation
    const reviewValidationResults = reviewsValidator.reviewValidator.validate(req.body, { abortEarly: false });

    if (reviewValidationResults.error) {
      const validationError = reviewValidationResults.error.details;
      validationError.forEach((errorMessage) => {
        errorObject[errorMessage.context.key] = errorMessage.message;
      });

      const listingID = req.params.listing_id;
      const listingCall = `${yelpAPIBase}/${listingID}`;

      //Individual Listing
      const listing = await yelpAPI(listingCall);
      const listingLocation = listing.location;

      //Yelp Reviews. Max of 3 reviews. Yelp API limitation. 
      const yelpReviews = await yelpAPI(`${listingCall}/reviews`)
      const allYelpReviews = yelpReviews.reviews

      const allIkemenReviews = await reviewModel.find({yelpID: listingID}).populate([{
        path: "user",
        select: "fullName preferredName email"
    }])

      res.render("./pages/listing.ejs", {
        listing,
        listingID,
        listingLocation,
        allIkemenReviews,
        allYelpReviews,
        errorObject,
      });
      return
    }

    const reviewValidated = reviewValidationResults.value;

    let user = await userModel.findOne({ email: req.session.user });

    //create review document in db
    try {
      const review = await reviewModel.create({
        content: reviewValidated.content,
        rating: reviewValidated.rating,
        user: user._id,
      });

      const listing = await listingModel.findOne({ yelpID: listingID })

      if (listing){
        const updateListing = await listingModel.findOneAndUpdate({ yelpID: listingID },
          {
            $push: {
              reviews: review._id,
            },
            avgRating: ((listing.avgRating * listing.reviewCount) + review.rating) / (listing.reviewCount + 1),
            $inc: {
              reviewCount: 1
            }
          }
        );
      }
      
      if (!listing){
        const newListing = await listingModel.create({
          yelpID: listingID,
          avgRating: review.rating,
          reviews: [review._id],
          reviewCount: 1
        })
      }

      res.redirect(`/food/${listingID}`);
    } catch (err) {
      console.log(err);
      res.send("cannot create review");
    }
  },

  showReview: async (req, res) => {
    const listingID = req.params.listing_id;
    const reviewID = req.params.review_id;

    let errorObject = {};

    try {
      
      //get listing info
      const listingCall = `${yelpAPIBase}/${listingID}`;
      const listing = await yelpAPI(listingCall);
  
      //get review info
      const review = await reviewModel.findById(reviewID).populate("user")

      res.render('./pages/edit_review.ejs', {
        errorObject,
        listing,
        listingID,
        review,
        reviewID
      })

    } catch (err) {
      console.log(err)
      res.send("cannot edit review right now")
    }
  },

  editReview: async (req, res) => {
    const listingID = req.params.listing_id;
    const reviewID = req.params.review_id;
    let errorObject = {};

    try {
      //get listing info
      const listingCall = `${yelpAPIBase}/${listingID}`;
      const listing = await yelpAPI(listingCall);

      //get review info
      const review = await reviewModel.findById(reviewID).populate("user")

      if(!review) {
        res.redirect(`/food/${listingID}`)
      }

      const reviewValidationResults = reviewsValidator.reviewValidator.validate(req.body, { abortEarly: false });

      if (reviewValidationResults.error) {
        const validationError = reviewValidationResults.error.details;
        validationError.forEach((errorMessage) => {
          errorObject[errorMessage.context.key] = errorMessage.message;
        });

        res.render('./pages/edit_review.ejs', {
          listing,
          listingID,
          review,
          reviewID,
          errorObject
        })
        return
      }

      const reviewValidated = reviewValidationResults.value;

      const updateReview = await reviewModel.findByIdAndUpdate(reviewID, {
        content: reviewValidated.content,
        rating: reviewValidated.rating,
        edited: true
      })

      res.redirect(`/food/${listingID}`)

    } catch (err) {
      console.log(err)
      res.send("cannot edit review right now")
    }
  },

  deleteReview: async (req, res) => {
    const listingID = req.params.listing_id;
    const reviewID = req.params.review_id;

    try {
      await reviewModel.findByIdAndDelete(reviewID);
      await listingModel.findOneAndUpdate({yelpID: listingID}, {
          $pull: {
              reviews: reviewID
          },
          $inc: {
            reviewCount: -1
          },
      });
      res.redirect(`/food/${listingID}`);


    } catch (err) {
      console.log(err)
      res.send("cannot delete review at the moment. please try again later")
    }
  }
};

module.exports = controller;
