const adminModel = require('../models/admin.model')
const { responseHandler } = require('../utils/responseHandler')
const { retrieveAllAdmins } = require('../services/admin.services')

const getAllAdmins = async (req, res) => {
    try {
        const check = await retrieveAllAdmins()

        if(check[0] == false) return responseHandler(res, check[1], 400, false)

        return responseHandler(res, "Admins retrieved successfully", 200, true, check[1])
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

module.exports = {
    getAllAdmins
}