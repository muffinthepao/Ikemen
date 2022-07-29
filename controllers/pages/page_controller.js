const controller = {

    showHome: (req, res) => {
        res.render('./pages/home.ejs')
    },

    showFood: async (req, res) => {
        res.send('listings')
    },


}

module.exports = controller