const { responseHandler } = require('../utils/responseHandler')
const { createAdmin, inviteNewAdmin, authenticateAdmin, updateInvitedAdmin } = require('../services/admin.services')
const sendMail  = require('../utils/email')


const signup = async (req, res, next) => {
    try {
        const check = await createAdmin(req.body)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Admin created successfully, proceed to login.', 201, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const check = await authenticateAdmin(password, email)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, null)
        // const { user, token} = check[1]

        return responseHandler(res, 'Login successful', 200, true, check[1])
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

        await sendMail("adminInvite", token.token, email)
        console.log(token)
        return responseHandler(res, 'Admin successfully invited', 200, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const acceptAdminInvitation = async (req, res) => {
    try {
        const { firstname, lastname, token, password, confirmPassword, email } = req.body

        if(password !== confirmPassword) return responseHandler(res, "Passwords do not match", 400, false, null)

        const check = await updateInvitedAdmin(firstname,lastname, email, password, token)

        if(check[0] == false) return responseHandler(res, check[1], 400, false, null)

        return responseHandler(res, 'Admin invitation successfully accepted', 200, true, null)
    } catch (error) {
        return responseHandler(res, error, 400, false)
    }
}

const getAllAdmin = async (req, res) => {
    try {
        const check = await retrieveAllAdmins()

        if(check[0] == false) return responseHandler(res, check[1], 400, false)

        return responseHandler(res, "Admins retrieved successfully", 200, true, check[1])
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