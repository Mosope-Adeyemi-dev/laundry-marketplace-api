const express = require('express')
const router = express.Router()

//controllers
const { uploadDocuments, updateAvailabilityStatus, registerNewService, listServices } = require('../controllers/merchant-profile.controller')

//validations
const { v_availabilityStatus } = require('../validations/merchant.validation')

//middlewares
const { validationMiddleware } = require('../middlewares/validation.middleware')
const verifyToken = require("../middlewares/merchant.middleware")

router.post('/merchant/profile/documents', verifyToken, uploadDocuments)
router.patch('/merchant/profile/availability',validationMiddleware(v_availabilityStatus), verifyToken, updateAvailabilityStatus)
router.post('/merchant/service/add', verifyToken, registerNewService)
router.get('/merchant/service/list', verifyToken, listServices)
module.exports = router