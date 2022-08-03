const bcrypt = require('bcrypt')
const userValidators = require('../validators/users')

const controller = {

  showRegistrationForm: (req, res) => {
    let errorObject = {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    }
    res.render('pages/register', {errorObject})
  },

  register: async (req, res) => {

    //Joi Validation
    const validationResults = userValidators.registerValidator.validate(req.body, {abortEarly: false})
    const validationError = validationResults.error.details

    if(validationError) {

      let errorObject = {
        email: null,
        fullName: null,
        password: null,
        confirmPassword: null,
      }

      validationError.forEach(errorMessage => {
        errorObject[errorMessage.context.key] = errorMessage.message
      })

      res.render('pages/register', {errorObject})
      return

      // res.send(`failed: ${validationResults.error}`)
      // console.log('failed: ', validationResults.error.details[0]['path'])
      // console.log('failed: ', validationResults.error.details[0]['context'])
    }

    res.send(`success: ${validationResults.value}`)
    console.log(validationResults.value)

    const validatedResults = validationResults.value

    const hash = await bcrypt.hash(validatedResults.password, 10)

    let newUser = ({
      name: validatedResults.full_name,
      email: validatedResults.email,
      password: validatedResults.password,
      hashbrown: hash
    })

    console.log(newUser)
    return

  },

  showLoginForm: (req, res) => {
    res.render('pages/login')
  },


};

module.exports = controller;