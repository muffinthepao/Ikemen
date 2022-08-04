const bcrypt = require('bcrypt')
const userModel = require('../../models/users/users')
const userValidators = require('../validators/users')

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

    //"push" user data into db
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

    res.redirect('/users/login')

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

      //get error messages
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
    const loginHash = await bcrypt.hash(loginValidated.password, 10)

    console.log('loginValidated.value: ', loginValidated)
    console.log('loginHash: ', loginHash)



    try {
      user = await userModel.findOne({email: loginValidated.email})
    } catch (err) {
      console.log(err)
      res.send('failed to get user')
      return

      let errorObject = {
        email: "Email and Password do not match",
        password: "Email and Password do not match"
      }
      console.log(err)
      res.render('pages/login', {errorObject})
      return
    }
    


  }


};

module.exports = controller;