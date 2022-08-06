// const bcrypt = require('bcrypt')
const userModel = require('../../models/authentication/users')
const userValidators = require('../validators/users')

const controller = {
  showProfile: async (req, res) => {
    // get user data from db using session user
    let user = await userModel.findOne({email: req.session.user})

    if (!user) {
        res.redirect('/login')
        return
    }

    res.render('user/profile', {user})
    // res.send(user)
  },
};

module.exports = controller;