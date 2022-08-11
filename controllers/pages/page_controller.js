const yelpAPI = require("../../source/yelp_api");

const allListingsURI ="https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20";
const yelpAPIBase = "https://api.yelp.com/v3/businesses";

const listingModel = require("../../models/listings/listings");
const reviewModel = require("../../models/reviews/reviews");
const userModel = require("../../models/authentication/users");

const controller = {
  showHome: (req, res) => {
    res.locals.firstName = "hello";
    res.locals.lastName = "world";
    res.render("./pages/home.ejs");
  },

  showListings: async (req, res) => {
    let errorObject = {};

    const page = parseInt(req.query.page)
    let pageArray = []
    const limit = 20
    const offset = (page - 1) * limit

    if (page < 4) {
       pageArray = [1, 2, 3, 4, 5]
    } else {
      pageArray = [page - 2, page - 1, page, page + 1, page + 2]
    }
    
    if(page) {
      const updatedAllListingsURI =`https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20&offset=${offset}`;

      const listOfFood = await yelpAPI(updatedAllListingsURI);
      const foodListings = listOfFood.businesses;
      res.render("./pages/food.ejs", { foodListings, errorObject, page, pageArray });
      return
    } 

    if(page > 50 || page < 0) {
      const listOfFood = await yelpAPI(allListingsURI);
      const foodListings = listOfFood.businesses;
    res.redirect('/food', {foodListings})

    }


    const listOfFood = await yelpAPI(allListingsURI);
    const foodListings = listOfFood.businesses;
    res.render("./pages/food.ejs", { foodListings, errorObject, page });
  },

  showIndividualListing: async (req, res) => {
    let errorObject = {};

    const listingID = req.params.listing_id;
    const listingCall = `${yelpAPIBase}/${listingID}`;

    //Individual Listing
    const listing = await yelpAPI(listingCall);
    const listingLocation = listing.location;

    //Yelp Reviews. Max of 3 reviews. Yelp API limitation.
    const yelpReviews = await yelpAPI(`${listingCall}/reviews`);
    const allYelpReviews = yelpReviews.reviews;

    //Ikemen Reviews
    const allIkemenReviews = await reviewModel
      .find({ yelpID: listingID })
      .populate([
        {
          path: "user",
          select: "fullName preferredName email",
        },
      ]);

    console.log(allIkemenReviews);

    res.render("./pages/listing.ejs", {
      listing,
      listingID,
      listingLocation,
      allIkemenReviews,
      allYelpReviews,
      errorObject,
    });
  },

  surprise: (req, res) => {
    res.render('./pages/surprise.ejs')
  }
};

module.exports = controller;
