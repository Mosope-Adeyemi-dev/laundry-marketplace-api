const express = require("express");
const router = express.Router();

//controllers
const {
  uploadDocuments,
  updateAvailabilityStatus,
  registerNewService,
  listServices,
  pendingOrders,
  getOrderHistory,
  saveMerchantAccount,
  getUSerInfo,
} = require("../controllers/merchant-profile.controller");

//validations
const { v_availabilityStatus } = require("../validations/merchant.validation");

//middlewares
const {
  validationMiddleware,
} = require("../middlewares/validation.middleware");
const verifyToken = require("../middlewares/merchant.middleware");

router.post("/merchant/profile/documents", verifyToken, uploadDocuments);
router.patch(
  "/merchant/profile/availability",
  validationMiddleware(v_availabilityStatus),
  verifyToken,
  updateAvailabilityStatus
);
router.post("/merchant/service/add", verifyToken, registerNewService);
router.get("/merchant/service/list", verifyToken, listServices);
router.get("/merchant/orders/pending", verifyToken, pendingOrders);
router.get('/merchant/orders/completed', verifyToken, getOrderHistory)
router.post('/merchant/bank-details/set', verifyToken, saveMerchantAccount)
router.get('/merchant/info', verifyToken, getUSerInfo)

module.exports = router;
