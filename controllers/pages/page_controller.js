const yelpAPI = require("../../source/yelp_api");

const allListingsURI ="https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20";
const yelpAPIBase = "https://api.yelp.com/v3/businesses";

const listingModel = require("../../models/listings/listings");
const reviewModel = require("../../models/reviews/reviews");
const saveModel = require("../../models/saves/saves");
const userModel = require("../../models/authentication/users");


const controller = {
  showHome: (req, res) => {
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
    const errorObject = {};

    const listingID = req.params.listing_id;
    const listingCall = `${yelpAPIBase}/${listingID}`;

    //Individual Listing
    const listing = await yelpAPI(listingCall);
    const listingLocation = listing.location;
    const listingLatLong = listing.coordinates;
    console.log(listingLatLong)

    //Yelp Reviews. Max of 3 reviews. Yelp API limitation.
    const yelpReviews = await yelpAPI(`${listingCall}/reviews`);
    const allYelpReviews = yelpReviews.reviews;

    //Ikemen Reviews
    const allIkemenReviews = await reviewModel
      .find({ yelpID: listingID })
      // .populate('user')
      .populate([
        {
          path: "user",
          select: "fullName preferredName email",
        },
      ])
      .sort({updatedAt: -1})

    //Find user
    const user = await userModel.findOne({ email: req.session.user });

    // Find savelisting of current user pertaining to this listing
    let savedListing = null
    if (user) {
      savedListing = await saveModel.findOne({user: user._id, yelpID: listingID})
    } 
    
    res.render("./pages/listing.ejs", {
      listing,
      listingID,
      listingLocation,
      listingLatLong,
      allIkemenReviews,
      allYelpReviews,
      savedListing,
      errorObject,
    });
  },

  showSurprise: (req, res) => {
    const surprise  = null
    const surpriseDbEntry= null

    res.render('./pages/surprise.ejs', {surprise, surpriseDbEntry})
  },

  randomListing: async (req, res) => {

    const page = Math.floor(Math.random()* 50)
    const limit = 20
    const offset = (page - 1) * limit

    const randomListingsURI =`https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20&offset=${offset}`;

    const listOfFood = await yelpAPI(randomListingsURI);
    const foodListings = listOfFood.businesses;

    const randomListing = Math.floor(Math.random()* limit)

    let surprise = foodListings[randomListing]

    let surpriseDbEntry = await listingModel.findOne({yelpID: surprise.id})

    res.render('./pages/surprise.ejs', {surprise, surpriseDbEntry} )

  },



};

module.exports = controller;
