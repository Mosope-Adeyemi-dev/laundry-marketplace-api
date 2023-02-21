const express = require('express')
const router = express.Router()

//controllers
const { signup, inviteAdmin, login, acceptAdminInvitation } = require('../controllers/admin-auth.controller')

//validations
const { v_createAdmin, v_inviteAdmin, v_loginAdmin, v_acceptInvite } = require('../validations/admin.validation')

//middlewares
const { validationMiddleware } = require('../middlewares/validation.middleware')
const verifyToken = require('../middlewares/super-admin.middleware')

router.post('/auth/admin/signup', validationMiddleware(v_createAdmin), signup)
router.post('/auth/admin/invite', validationMiddleware(v_inviteAdmin), verifyToken, inviteAdmin)
router.post('/auth/admin/login', validationMiddleware(v_loginAdmin), login)
router.put('/auth/admin/accept-invite', validationMiddleware(v_acceptInvite), acceptAdminInvitation)

module.exports = router