const router = require('express').Router();
const {
  paymentInitialization,
  verifyTransactionStatus,
  transferFunds,
  setupTransactionPin,
  getWalletBalance,
  getTransactionHistory,
  getTransactionDetail,
  getBanksList,
  verifyBankAccount,
  withdrawFunds,
} = require('../controllers/transaction.controller');
const verifyToken = require("../middlewares/customer.middleware")

router.post('/payment/initialize', verifyToken, paymentInitialization);
router.get(
  '/wallet/verify-transaction',
  verifyToken,
  verifyTransactionStatus
);
// router.post('/wallet/transfer-fund', verifyToken, transferFunds);
// router.put('/wallet/pin/set', verifyToken, setupTransactionPin);
// router.get('/wallet/balance', verifyToken, getWalletBalance);

router.get('/payment/banks', getBanksList);
router.post('/payment/banks/resolve-account', verifyBankAccount);
router.get("/payment/verify", verifyToken, verifyTransactionStatus);
// router.post('/wallet/withdraw', verifyToken, withdrawFunds);

module.exports = router;
