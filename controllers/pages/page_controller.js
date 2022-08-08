const yelpAPI = require("../../source/yelp_api");

const allListingsURI ="https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20";
const yelpAPIBase = "https://api.yelp.com/v3/businesses";

const listingModel = require("../../models/listings/listings");
const reviewModel = require("../../models/reviews/reviews");

const controller = {
    showHome: (req, res) => {
        res.locals.firstName = "hello"
        res.locals.lastName = "world"
        res.render("./pages/home.ejs");
    },

    showListings: async (req, res) => {
        let errorObject = {}

        const listOfFood = await yelpAPI(allListingsURI);
        const foodListings = listOfFood.businesses
        res.render("./pages/food.ejs", { foodListings, errorObject });
    },

    showIndividualListing: async (req, res) => {
        let errorObject = {}

        const listingID = req.params.listing_id;
        const listingCall = `${yelpAPIBase}/${listingID}`;

        //Individual Listing
        const listing = await yelpAPI(listingCall);
        const listingLocation = listing.location;

        //Yelp Reviews. Max of 3 reviews. Yelp API limitation. 
        const yelpReviews = await yelpAPI(`${listingCall}/reviews`)
        const allYelpReviews = yelpReviews.reviews

        //Ikemen Reviews
        const allIkemenReviews = await reviewModel.find({yelpID: listingID}).populate("user")
        console.log(allIkemenReviews)

        res.render("./pages/listing.ejs", {
          listing,
          listingID,
          listingLocation,
          allIkemenReviews,
          allYelpReviews,
          errorObject
        });
    },
};

module.exports = controller;
