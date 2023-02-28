const adminModel = require('../models/admin.model')
const bcrypt = require('bcrypt')
const { translateError } = require('../utils/mongo_helper')
const generateOtp = require('../utils/otp')
const { createToken } = require('../utils/token')
const moment = require("moment")
const merchantModel = require('../models/merchant.model')

const createAdmin = async (newAdmin) => {
    try {
        const { firstname, lastname, role, password, email } = newAdmin
        const newUser = await adminModel.create({
            firstname,
            lastname,
            role,
            email,
            password: await bcrypt.hash(password, 10)
        })

        if(!newUser) return [false, 'Failed to create admin']

        return [true, newUser]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to create new Admin"]
    }
}

const inviteNewAdmin = async (email, role, id) => {
    try {
        const admin = await adminModel.create({
            email,
            token: {
                token: generateOtp(5),
                expires: moment(new Date).add(10, 'm').toDate(),
            },
            invitedBy: id,
            role
        })

        if(!admin) return [false, 'Unable to invite admin.']

        return [true, {
            token: admin.token,
            email
        }]
    } catch (error) {
        console.log(error.msg)
        return [false, translateError(error) || "Unable to invite admin."]
    }
}

const authenticateAdmin = async (password, email) => {
    try {
        const user = await adminModel.findOne({email}).select("email firstname lastname role password")

        if(!await bcrypt.compare(password, user.password)) return [false, 'Incorrect username or password.']

        const token = await createToken(user.id)

        
        const { firstname, lastname, role } = user

        return [true, { token, user: {
            firstname,
            lastname,
            email: user.email,
            role
        } }]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || 'Unable to login.']
    }
}

const updateInvitedAdmin = async (firstname,lastname, email, password, token) => {
    try {
        const foundAdmin = await adminModel.findOne({email})
        console.log(foundAdmin)

        if(!foundAdmin) return [false, "Unable to process request."]

        if((Date.now() > new Date(foundAdmin.token.expires).getTime()) || foundAdmin.token.token != token) {
            return [false, "Invalid or expired token."]
        }

        const updateAdmin = await adminModel.findOneAndUpdate({email}, { firstname, lastname, invitationAccepted: true, password: await bcrypt.hash(password, 10)})

        if(updateAdmin) return [true, updateAdmin]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || 'Unable to accept admin invite.']
    }
}

const retrieveAllAdmins = async () => {
    try {
        const admins = await adminModel.find().select("firstname lastname email role status")
        return [true, admins]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || 'Unable to retrieve system admins.']
    }
}

const getAllMerchants = async () => {
    try {
        const merchants = await merchantModel.find().select("fullName email isActive storeAddress businessName phoneNumber isApproved")
        return [true, merchants]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || 'Unable to retrieve merchants.']
    }
}

const changeMerchantStatus = async (merchantId, isActive) => {
    try {
        const merchant = await merchantModel.findByIdAndUpdate(merchantId, { isActive }, { new: true})
        console.log(merchant)
        if(!merchant) return [false, "Unable to update merchant status"]
        return [true, merchant]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || 'Unable to update merchant status.']
    }
}

module.exports = {
    createAdmin,
    inviteNewAdmin,
    authenticateAdmin, 
    updateInvitedAdmin,
    retrieveAllAdmins,
    getAllMerchants,
    changeMerchantStatus
}