const Joi = require('joi')

const v_registerMerchant = Joi.object({
    email: Joi.string().required().email(),
    fullName: Joi.string().required(),
    businessName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    state: Joi.string().required(),
    storeAddress: Joi.string().required(),
})

const v_loginMerchant = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

const v_setPassword = Joi.object({
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().required().min(8)
})

const v_availabilityStatus = Joi.object({
    isAvailable: Joi.boolean().required(),
})

const v_addService = Joi.object({
    price: Joi.number().required(),
    name: Joi.string().required(),
    photo: Joi.binary().required()
})

module.exports = {
    v_registerMerchant,
    v_setPassword,
    v_availabilityStatus,
    v_addService,
    v_loginMerchant
}
