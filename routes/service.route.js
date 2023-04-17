const express = require('express')
const router = express.Router()

//controllers
const { retrievePopularServices, findServices } = require('../controllers/service.controller')

//validations
// const { v_availabilityStatus } = require('../validations/service.validation')

//middlewares
// const { validationMiddleware } = require('../middlewares/validation.middleware')
// const verifyToken = require("../middlewares/merchant.middleware")

router.get("/services/popular", retrievePopularServices)
router.get("/services/search", findServices)
module.exports = router

// get merchant info by id from customer