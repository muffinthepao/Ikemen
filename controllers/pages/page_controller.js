// const food = require('../../source/yelp_api')

const controller = {
  showHome: (req, res) => {
      res.render("./pages/home.ejs");
  },

  showListings: async (req, res) => {
      try {
          const url ="https://api.yelp.com/v3/businesses/search?term=noodles&location=Singapore&limit=20";
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
      const listingID = req.params.listing_id

      try {
        const url =`https://api.yelp.com/v3/businesses/${listingID}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: process.env.YELP_API,
            },
        });

        const listing = await response.json();
        res.render("./pages/listing.ejs", { listing });
        // res.render('./pages/listing.ejs', {listingID})
        
      } catch (err) {
        console.log(err)
      }

  },
};

module.exports = controller;
