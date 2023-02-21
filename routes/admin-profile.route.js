const router = require("express").Router()
const { getAllAdmins } = require("../controllers/admin-profile.controller")
const verifySuperAdminToken = require("../middlewares/super-admin.middleware")

router.get('/admin/list', verifySuperAdminToken, getAllAdmins)

module.exports = router