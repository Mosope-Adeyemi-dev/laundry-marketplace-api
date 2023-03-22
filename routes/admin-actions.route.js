const router = require("express").Router();

const {
  listMerchants,
  updateMerchantStatus,
  getMerchantInfo,
  approveMerchantAccount,
  getOrders,
} = require("../controllers/admin-actions.controller");

const verifyToken = require("../middlewares/admin-auth.middleware");
const {
  validationMiddleware,
} = require("../middlewares/validation.middleware");

const {
  v_merchantStatus,
  v_approveMerchant,
} = require("../validations/admin.validation");

router.get("/admin/list/merchants", verifyToken, listMerchants);
router.patch(
  "/admin/merchant-status",
  validationMiddleware(v_merchantStatus),
  verifyToken,
  updateMerchantStatus
);
router.get("/admin/list/merchants/:merchantId", verifyToken, getMerchantInfo);
router.post(
  "/admin/merchant/approve",
  validationMiddleware(v_approveMerchant),
  verifyToken,
  approveMerchantAccount
);
router.get("/admin/orders", verifyToken, getOrders);
module.exports = router;
