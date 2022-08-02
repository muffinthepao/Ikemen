const bcrypt = require('bcrypt')
const userValidators = require('../validators/users')

const controller = {

  showRegistrationForm: (req, res) => {
    res.render('pages/register')
  },

  register: async (req, res) => {

    //Joi Validation
    const validationResults = userValidators.registerValidator.validate(req.body, {abortEarly: false})

    if(validationResults.error) {
      res.send(`failed: ${validationResults.error}`)
      console.log('failed: ', validationResults.error.details[0]['path'])
      console.log('failed: ', validationResults.error.details[0]['context'])
      return
    }

    // res.send(`success: ${validationResults.value}`)
    // console.log(validationResults.value)

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

  }


};

module.exports = controller;