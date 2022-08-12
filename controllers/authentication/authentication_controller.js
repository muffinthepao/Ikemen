const bcrypt = require('bcrypt')
const userModel = require('../../models/authentication/users')
const userValidators = require('../Joi validators/users')

const controller = {

  showRegistrationForm: (req, res) => {
    let errorObject = {}
    res.render('pages/register', {errorObject})
  },

  register: async (req, res) => {

    //Joi Validation
    const registerValidationResults = userValidators.registerValidator.validate(req.body, {abortEarly: false})

    if(registerValidationResults.error) {
      //null object to load register.ejs
      let errorObject = {}

      //get error messages
      const validationError = registerValidationResults.error.details
      validationError.forEach(errorMessage => {
        errorObject[errorMessage.context.key] = errorMessage.message
      })

      res.render('pages/register', {errorObject})
      return

      // res.send(`failed: ${registerValidationResults.error}`)
      // console.log('failed: ', registerValidationResults.error.details[0]['path'])
      // console.log('failed: ', registerValidationResults.error.details[0]['context'])
    }
    
    const registerValidated = registerValidationResults.value

    //turn password string to hashed value
    const registerHash = await bcrypt.hash(registerValidated.password, 10)

    //create user document in db
    try {
      await userModel.create({
        fullName: registerValidated.fullName,
        preferredName: registerValidated.preferredName,
        email: registerValidated.email,
        hash: registerHash,
      })
    } catch (err) {
      console.log(err)
      // console.log(err.keyValue.email)

      let errorObject = {
        email: `${err.keyValue.email} has already been taken`,
      }
      res.render('pages/register', {errorObject})
      return
    }

    res.redirect('/login')

  },

  showLoginForm: (req, res) => {
    let errorObject = {}
    res.render('pages/login', {errorObject})
  },

  login: async (req, res) => {
    //Joi Validation
    const loginValidationResults = userValidators.loginValidator.validate(req.body, {abortEarly: false})

    if(loginValidationResults.error) {
      //null object to load register.ejs
      let errorObject = {}

      //get Joi validation error messages
      const validationError = loginValidationResults.error.details
      validationError.forEach(errorMessage => {
        errorObject[errorMessage.context.key] = errorMessage.message
      })

      res.render('pages/login', {errorObject})
      return

      // res.send(`failed: ${loginValidationResults.error}`)
      // console.log('failed: ', loginValidationResults.error.details[0]['path'])
      // console.log('failed: ', loginValidationResults.error.details[0]['context'])
    }

    const loginValidated = loginValidationResults.value

    let user = await userModel.findOne({email: loginValidated.email})

    //check if it's a registered email
    if (user == null) {
      let errorObject = {
        email: "Email and Password do not match",
        password: "Email and Password do not match"
      }

      res.render('pages/login', {errorObject})
      return
    }

    //after finding registered email, compare password.
    let passwordMatch = await bcrypt.compare(loginValidated.password, user.hash)
    if (!passwordMatch) {
      let errorObject = {
        email: "Email and Password do not match",
        password: "Email and Password do not match"
      }

      res.render('pages/login', {errorObject})
      return
    }

    // log the user in by creating session anew
    req.session.regenerate(function (err) {
      if (err) {
          res.send('unable to regenerate session')
          return
      }
  
      // store user information in session, typically a user id
      req.session.user = user.email
  
      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
          if (err) {
              res.send('unable to save session')
              return
          }

          res.redirect('/user/profile')
          // res.redirect('/')
      })
    })
    
  },

  logout: async (req, res) => {
    req.session.user = null

        req.session.save(function (err) {
            if (err) {
                res.redirect('/users/login')
                return
            }

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate(function (err) {
                if (err) {
                    res.redirect('/users/login')
                    return
                }
                
                res.redirect('/')
            })
        })
  }
};

module.exports = controller;