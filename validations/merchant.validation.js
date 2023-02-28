const Joi = require('joi')

const v_registerMerchant = Joi.object({
    email: Joi.string().required().email(),
    fullName: Joi.string().required(),
    businessName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    state: Joi.string().required(),
    storeAddress: Joi.string().required(),
})

const v_setPassword = Joi.object({
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().required().min(8)
})

const v_availabilityStatus = Joi.object({
    isAvailable: Joi.boolean().required(),
})

module.exports = {
    v_registerMerchant,
    v_setPassword,
    v_availabilityStatus
}
