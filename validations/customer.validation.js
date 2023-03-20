const Joi = require('joi')

const v_signup = Joi.object({
    email: Joi.string().required().email(),
    fullname: Joi.string().required(),
    password: Joi.string().required().min(8),
    phoneNumber: Joi.string().required()
})

const v_login = Joi.object({
    email: Joi.string().required().email(),
    password:  Joi.string().required().min(8),
})

const v_addToCart = Joi.object({
    serviceId: Joi.string().required(),
    quantity:  Joi.number().required()
})

const v_placeOrder = Joi.object({
    deliveryType: Joi.string().required().valid("pick-up", "drop-off"),
    pickUpAddress: Joi.string(),
    dropOffAddress: Joi.string(),
    paymentMethod: Joi.string().required().valid("online", "cash")
})

module.exports = {
    v_signup,
    v_login,
    v_addToCart,
    v_placeOrder
}