const controller = {

    showHome: (req, res) => {
        res.render('./pages/home.ejs')
    },

    showFood: async (req, res) => {
        // res.send('listings')
        const url = 'https://api.yelp.com/v3/businesses/search?term=food&location=Singapore'
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.YELP_API}`
            }
        });

        const json = await response.json()

        res.send(json)
    },


}

module.exports = controller