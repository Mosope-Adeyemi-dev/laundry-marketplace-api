const express = require('express')
const router = express.Router()

//controllers
const { register, setMerchantPassword } = require('../controllers/merchant-auth.controller')

//validations
const { v_registerMerchant,v_setPassword } = require('../validations/merchant.validation')

//middlewares
const { validationMiddleware } = require('../middlewares/validation.middleware')
const verifyToken = require("../middlewares/merchant.middleware")

router.post('/auth/merchant/register', validationMiddleware(v_registerMerchant), register)
router.put('/auth/merchant/set-password', validationMiddleware(v_setPassword), verifyToken, setMerchantPassword)

module.exports = router