const router = require("express").Router();

//controllers
const {
  signup,
  login,
  addServiceToCart,
  retrieveCart,
  placeNewOrder,
  retrieveOrders,
  getMerchantInfo
} = require("../controllers/customer.controller");
const {
  paymentInitialization,
} = require("../controllers/transaction.controller");

//validations
const {
  v_signup,
  v_login,
  v_addToCart,
  v_placeOrder,
} = require("../validations/customer.validation.js");

//middlewares
const {
  validationMiddleware,
} = require("../middlewares/validation.middleware");
const verifyToken = require("../middlewares/customer.middleware");

router.post("/auth/customer/signup", validationMiddleware(v_signup), signup);
router.post("/auth/customer/login", validationMiddleware(v_login), login);
router.post(
  "/customer/cart/add",
  verifyToken,
  validationMiddleware(v_addToCart),
  addServiceToCart
);
router.get("/customer/cart", verifyToken, retrieveCart);
router.post(
  "/customer/order/place",
  verifyToken,
  validationMiddleware(v_placeOrder),
  placeNewOrder
);
router.get("/customer/order/list", verifyToken, retrieveOrders);
router.post("/customer/order/payment", verifyToken, validationMiddleware(v_placeOrder), paymentInitialization);
router.get("/customer/merchant/:merchantId/info", getMerchantInfo)

module.exports = router;
