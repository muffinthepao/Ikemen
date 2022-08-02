const Joi = require('joi')

const validators = {

    registerValidator: Joi.object({
        fullName: Joi.string().min(3).label("Full Name").required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).label("Email").required(),
        password: Joi.string().min(3).label("Password").required(),
        // confirm_password: Joi.string().min(4).required()
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
            "any.only" : "Passwords must match"
          })
    })
    
}

module.exports = validators