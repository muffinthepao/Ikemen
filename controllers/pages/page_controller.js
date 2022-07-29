const controller = {
    showHome: (req, res) => {
        res.render("./pages/home.ejs");
    },

    showFood: async (req, res) => {
        // res.send('listings')
        const url ="https://api.yelp.com/v3/businesses/search?term=food&location=Singapore&limit=20&offset=40";
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: process.env.YELP_API,
            },
        });

        const json = await response.json();
        const foodListings = json.businesses

        // res.send(foodListings[0]);
        res.render("./pages/food.ejs", {foodListings})
    },
};

module.exports = controller;
