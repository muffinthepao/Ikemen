const userModel = require('../../models/authentication/users')
const userValidators = require('../Joi validators/users')

const controller = {
  showProfile: async (req, res) => {

    let errorObject = {}
    // get user data from db using session user
    let user = await userModel.findOne({email: req.session.user})

    if (!user) {
        res.redirect('/login')
        return
    }

    res.render('user/profile', {user, errorObject})
    // res.send(user)
  },
};

module.exports = controller;