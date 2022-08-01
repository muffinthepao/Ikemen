const Joi = require('joi')

const validators = {

    registerValidator: Joi.object({
        full_name: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().min(3).required(),
        // confirm_password: Joi.string().min(4).required()
        confirm_password: Joi.ref('password')
    })
    
}

module.exports = validators