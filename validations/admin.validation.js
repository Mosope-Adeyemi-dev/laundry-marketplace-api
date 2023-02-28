const Joi = require('joi')

const v_createAdmin = Joi.object({
    email: Joi.string().required().email(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required().min(8),
    role: Joi.string().required().allow('admin', 'super-admin')
})

const v_inviteAdmin = Joi.object({
    email: Joi.string().required().email(),
    role:  Joi.string().required().valid('admin', 'super-admin')
})

const v_loginAdmin = Joi.object({
    email: Joi.string().required().email(),
    password:  Joi.string().required().min(8),
})

const v_acceptInvite = Joi.object({
    email: Joi.string().email().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    token: Joi.string().required(),
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().required().min(8)
}) 

const v_merchantStatus = Joi.object({
    isActive: Joi.boolean().required(),
    merchantId: Joi.string().required()
})

module.exports = {
    v_createAdmin,
    v_inviteAdmin,
    v_loginAdmin,
    v_acceptInvite,
    v_merchantStatus
}