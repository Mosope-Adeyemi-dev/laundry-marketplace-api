const { registerMerchant, setPassword, authenticateMerchant } = require("../services/merchant.service")
const { responseHandler } = require('../utils/responseHandler')
const formidable = require("formidable")

const register = async (req, res) => {
    try {
        const check = await registerMerchant(req.body)

        if (check[0] == false) return responseHandler(res, check[1], 400, false, '')

        return responseHandler(res, 'Merchant registered successfully.', 201, true, { token: check[1] })
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}

const setMerchantPassword =  async (req, res) => {
    try {
        const check = await setPassword(req.user, req.body.password)

        if (check[0] == false) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Merchant password set successfully.', 200, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const check = await authenticateMerchant(email, password)

        if(check[0] == false) return responseHandler(res, check[1], check[2], false, null)

        return responseHandler(res, 'Login successful', 200, true, check[1])
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

module.exports = {
    register,
    login,
    setMerchantPassword
}