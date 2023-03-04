const merchantModel = require('../models/merchant.model')
const bcrypt = require('bcrypt')
const { translateError } = require('../utils/mongo_helper')
const generateOtp = require('../utils/otp')
const { createToken } = require('../utils/token')
const serviceModel = require('../models/service.model')
const { default: mongoose } = require('mongoose')

const registerMerchant = async (body) => {
    try {
        const { fullName, businessName, phoneNumber, storeAddress, state, email } = body
        const newUser = await merchantModel.create({
            fullName,
            businessName,
            phoneNumber,
            storeAddress,
            state,
            email,
            merchantId: "LD" + generateOtp(8)
        })

        if(!newUser) return [false, 'Failed to register merchant']

        const token = await createToken(newUser.id)

        return [true, token]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to register merchant"]
    }
}

const authenticateMerchant =  async (email, password)=> {
    try {
        const result = await merchantModel.findOne({email}).select('email password isApproved')
        if(!result) return [false, "Incorrect username or password.", 400]

        if(!await bcrypt.compare(password, result.password)) return [false, "Incorrect username or password", 400]

        if(!result. isApproved) return [false, "You're account is still pending verification. Please contact support", 403]

        return [true, await createToken(result.id)]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to login"]
    }
}

const uploadMerchantDoc = async (id, idType, idUrl, cacUrl) => {
    try {
        const result = await merchantModel.findByIdAndUpdate(id, {
            cacDocument: cacUrl,
            ownerID: idUrl,
            ownerIDType: idType
        }, {new: true})

        if(!result) return [false, 'Failed to upload verification documents, try again']
        console.log(result)

        return [true]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to upload verification documents, try again"]
    }
}

const setPassword = async (id, password) => {
    try {
        const result = await merchantModel.findByIdAndUpdate(id, 
            { 
                password: await bcrypt.hash(password, 10), 
                completedRegistration: true 
            }, 
            { new: true })
            console.log(result)
        if(!result) return [false, 'Unable to set password, try again']
        return [true]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to upload verification documents, try again"]
    }
}

const updateAvailability = async (id, status) => {
    try {
        const result = await merchantModel.findByIdAndUpdate(id, {availabilityStatus: status}, { new: true })
        console.log(result)
        if(!result) return [false, 'Unable to update availability status']
        return [true]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to update availability status"]
    }
}

const listNewService = async (name, merchantId, price, photo) => {
    try {
        const result = await serviceModel.create({
            name,
            price,
            merchantId: new mongoose.Types.ObjectId(merchantId),
            photo
        })
        if(!result) return [false, 'Unable to list new service']
        console.log(result)
        return [true]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to list new service"]
    }
}

const getMerchantServices = async (merchantId) => {
    try {
        const result = await serviceModel.find({merchantId})
        return [true, result]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable get merchant services."]
    }
}

module.exports = {
    registerMerchant,
    uploadMerchantDoc,
    setPassword,
    updateAvailability,
    listNewService,
    authenticateMerchant,
    getMerchantServices
}