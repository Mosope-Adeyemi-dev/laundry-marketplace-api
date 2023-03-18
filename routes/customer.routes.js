const router = require('express').Router()

//controllers
const { signup, login, } = require('../controllers/customer.controller')

//validations
const { v_signup, v_login } = require('../validations/customer.validation.js')

//middlewares
const { validationMiddleware } = require('../middlewares/validation.middleware')
const verifyToken = require('../middlewares/super-admin.middleware')

router.post('/auth/customer/signup', validationMiddleware(v_signup), signup)
router.post('/auth/customer/login', validationMiddleware(v_login), login)

module.exports = router;
