const router = require("express").Router()

const { listMerchants, updateMerchantStatus } = require("../controllers/admin-actions.controller")

const verifyToken = require("../middlewares/admin-auth.middleware")
const { validationMiddleware } = require('../middlewares/validation.middleware')

const { v_merchantStatus } = require("../validations/admin.validation")

router.get('/admin/list/merchants', verifyToken, listMerchants)
router.patch('/admin/merchant-status', validationMiddleware(v_merchantStatus), verifyToken, updateMerchantStatus)

module.exports = router