const adminModel = require('../models/admin.model')
const { responseHandler } = require('../utils/responseHandler')
const { createAdmin, inviteNewAdmin, autheniticateAdmin, updateIvitedAdmin } = require('../services/admin.services')
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {
    try {
        const check = await createAdmin(req.body)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, '')

        return responseHandler(res, 'Admin created succesfully, proceed to login.', 201, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const check = await autheniticateAdmin(password, email)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, '')
        // const { user, token} = check[1]

        return responseHandler(res, 'Login succesful', 200, true, check[1])
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const inviteAdmin = async (req, res, next) => {
    try {
        const check =  await inviteNewAdmin(req.body.email, req.body.role, req.user)
        console.log(check)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, null)

        const { token, email } = check[1]
        console.log(token)
        return responseHandler(res, 'Admin succesfully invited', 200, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const acceptAdminInvitation = async (req, res) => {
    try {
        const { firstname, lastname, token, password, confirmPassword, email } = req.body

        if(password !== confirmPassword) return responseHandler(res, "Passwords do not match", 400, false, null)

        const check = await updateIvitedAdmin(firstname,lastname, email, password, token)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Admin invitation succesfully accepted', 200, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const getAllAdmin = async (req, res) => {
    try {
        const check = await retrieveAllAdmins()

        if(check[0] == false) return responseHandler(res, check[1], 400, false)

        return responseHandler(res, "Admins retrieved succesfully", 200, true, check[1])
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

module.exports = {
    signup,
    login,
    inviteAdmin,
    acceptAdminInvitation,
    getAllAdmin
}