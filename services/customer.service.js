const customerModel = require('../models/customer.model')
const bcrypt = require('bcrypt')
const { translateError } = require('../utils/mongo_helper')
const { createToken } = require('../utils/token')

exports.registerCustomer =  async (body) => {
    try {
        const { firstname, lastname, role, password, email } = newAdmin
        const newUser = await customerModel.create({
            firstname,
            lastname,
            role,
            email,
            password,
        })

        if(!newUser) return [false, 'Failed to register user']

        return [true, newUser]
    } catch (error) {
        console.log(error)
        return [false, translateError(error) || "Unable to register user"]
    }
}