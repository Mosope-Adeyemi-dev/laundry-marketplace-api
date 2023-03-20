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
router.post('/wallet/transfer-fund', verifyToken, transferFunds);
router.put('/wallet/pin/set', verifyToken, setupTransactionPin);
router.get('/wallet/balance', verifyToken, getWalletBalance);
router.get(
  '/wallet/transaction-history',
  verifyToken,
  getTransactionHistory
);
router.get(
  '/wallet/transaction-history/:transactionId',
  verifyToken,
  getTransactionDetail
);
router.get('/wallet/banks', verifyToken, getBanksList);
router.post('/wallet/bank/verify-account', verifyToken, verifyBankAccount);
router.post('/wallet/withdraw', verifyToken, withdrawFunds);

module.exports = router;
