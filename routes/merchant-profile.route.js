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
  completeOrder
} = require("../controllers/merchant-profile.controller");

//validations
const { v_availabilityStatus, v_fulfillOrder } = require("../validations/merchant.validation");

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
router.post('/merchant/orders/fulfill', validationMiddleware(v_fulfillOrder), verifyToken, completeOrder)

module.exports = router;
