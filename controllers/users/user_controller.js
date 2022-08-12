const userModel = require('../../models/authentication/users')
const userValidators = require('../Joi_validators/users')

const controller = {
  showProfile: async (req, res) => {

    let errorObject = {}
    // get user data from db using session user
    const user = await userModel.findOne({email: req.session.user})

    if (!user) {
        res.redirect('/login')
        return
    }

    res.render('user/profile', {user, errorObject})
    // res.send(user)
  },

  updateUserDetails: async (req, res) => {
    let errorObject = {};
    const user = await userModel.findOne({email: req.session.user});

    try {
      const userValidationResults = userValidators.updateDetailsValidator.validate(
        req.body,
        { abortEarly: false }
      );

      if (userValidationResults.error) {
        const validationError = userValidationResults.error.details;

        validationError.forEach((errorMessage) => {
          errorObject[errorMessage.context.key] = errorMessage.message;
        });

        res.render("user/profile", {
          user,
          errorObject,
        });
        return;
      };

      const userDetailsValidated = userValidationResults.value;

      await userModel.findOneAndUpdate({email: req.session.user}, 
        {
          fullName: userDetailsValidated.fullName,
          preferredName: userDetailsValidated.preferredName,
          email: userDetailsValidated.email,
        }
      )


      res.redirect(307, '/logout')
    } catch (err) {
      console.log(err)
      res.send("unable to update user at this moment")
    }
  }
};

module.exports = controller;