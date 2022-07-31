// const food = require('../../source/yelp_api')

const YELP_API_URI = "https://api.yelp.com/v3/businesses";

const controller = {
    showHome: (req, res) => {
        res.render("./pages/home.ejs");
    },

    showListings: async (req, res) => {
        try {
            const url =
                "https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: process.env.YELP_API,
                },
            });

            const json = await response.json();
            const foodListings = json.businesses;

            // res.send(foodListings[0]);
            res.render("./pages/food.ejs", { foodListings });
        } catch (err) {
            console.log(err);
            res.send("Failed to fetch API");
        }
        // res.send(foodListings[0]);
    },

    showIndividualListing: async (req, res) => {
        // res.render("./pages/home.ejs");
        const listingID = req.params.listing_id;

        try {
            const listingCall = `${YELP_API_URI}/${listingID}`;
            const listingResponse = await fetch(listingCall, {
                method: "GET",
                headers: {
                    Authorization: process.env.YELP_API,
                },
            });

            const listingReviewsCall = `${YELP_API_URI}/${listingID}/reviews`;
            const listingReviewsResponse = await fetch(listingReviewsCall, {
                method: "GET",
                headers: {
                    Authorization: process.env.YELP_API,
                },
            });

            const listing = await listingResponse.json();
            const listingLocation = listing.location;
            
            const listingReviews = await listingReviewsResponse.json();
            const allListingReviews = listingReviews.reviews;

            // console.log(listing)
            res.render("./pages/listing.ejs", { listing, listingLocation, allListingReviews });
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = controller;
