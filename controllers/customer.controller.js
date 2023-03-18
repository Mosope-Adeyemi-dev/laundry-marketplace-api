const { registerCustomer, authenticateCustomer } = require("../services/customer.service")
const { responseHandler } = require('../utils/responseHandler')
const formidable = require("formidable")

const signup = async (req, res) => {
    try {
        const check = await registerCustomer(req.body)

        if (check[0] == false) return responseHandler(res, check[1], 400, false, '')

        return responseHandler(res, 'User registered successfully.', 201, true, { token: check[1] })
    } catch (error) {
        return responseHandler(res, error, 400, false, null)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const check = await authenticateCustomer(email, password)

        if(check[0] == false) return responseHandler(res, check[1], check[2], false, null)

        return responseHandler(res, 'Login successful', 200, true, { token: check[1] })
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

module.exports = {
    signup,
    login,
}