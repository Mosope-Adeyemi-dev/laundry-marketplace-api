const express = require('express')
const router = express.Router()

//controllers
const { signup } = require('../controllers/admin-auth.controller')

router.post('/auth/admin/signup', signup)
// router.post('/auth/admin/login')
// router.patch('/auth/admin/change-password')

module.exports = router