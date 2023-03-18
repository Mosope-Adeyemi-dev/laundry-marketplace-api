const Joi = require('joi')

const v_signup = Joi.object({
    email: Joi.string().required().email(),
    fullname: Joi.string().required(),
    password: Joi.string().required().min(8),
})

const v_login = Joi.object({
    email: Joi.string().required().email(),
    password:  Joi.string().required().min(8),
})

module.exports = {
    v_signup,
    v_login
}