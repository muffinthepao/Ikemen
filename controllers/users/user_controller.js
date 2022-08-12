const bcrypt = require('bcrypt')
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
  },

  changePassword: async (req, res) => {
    let errorObject = {};
    const user = await userModel.findOne({email: req.session.user});

    //Joi Validation
    const changePasswordValidationResults = userValidators.changePasswordValidator.validate(req.body, {abortEarly: false})

    if(changePasswordValidationResults.error) {
      //null object to load register.ejs
      let errorObject = {}

      //get error messages
      const validationError = changePasswordValidationResults.error.details
      validationError.forEach(errorMessage => {
        errorObject[errorMessage.context.key] = errorMessage.message
      })

      res.render("user/profile", {
        user,
        errorObject,
      });
      return;
    }

    const changePasswordValidated = changePasswordValidationResults.value

    let currentPasswordMatch = await bcrypt.compare(changePasswordValidated.currentPassword, user.hash)

    if (!currentPasswordMatch) {
      let errorObject = {
        currentPassword: "Current Password does not match"
      }
    }

    const newPasswordHash = await bcrypt.hash(changePasswordValidated.newPassword, 10)

    try {
      await userModel.findOneAndUpdate({email: req.session.user}, 
        {
          hash: newPasswordHash
        }
      )

      res.redirect(307, '/logout')
    } catch (err) {
      console.log(err)
      res.send("cannot change password at the moment")
    }
  }
};

module.exports = controller;