const { 
  initializePaystackCheckout, 
  verifyTransaction, 
  transferFund, 
  setPin, 
  calculateWalletBalance,
  getUserTransactions,
  getTransaction,
  getPaystackBankLists,
  resolveBankAccount,
  initializeTransfer,
} = require('../services/transaction.service');
const { responseHandler } = require('../utils/responseHandler');

const paymentInitialization = async (req, res) => {
  try {
    const check = await initializePaystackCheckout(
      req.email,
      req.user,
      req.body
    );

    if (!check[0]) {
      return responseHandler(
        res,
        check[1],
        400,
        false,
      );
    }

    return responseHandler(res, 'Initialization successful', 200, true, check[1]);
  } catch (error) {
    return responseHandler(
      res,
      'An error occurred. Try again',
      500,
      false,
      error
    );
  }
};

const verifyTransactionStatus = async (req, res) => {
  try {
    if (req.query.reference === undefined) {
      return responseHandler(
        res,
        'Invalid request. Include reference ID',
        400,
        true,
        ''
      );
    }

    const check = await verifyTransaction(req.query.reference);

    if (check[0]) {
      return responseHandler(
        res,
        'Transaction verification successful',
        200,
        false,
        check[1]
      );
    }

    return responseHandler(
      res,
      check[1] || 'Transaction verification failed',
      400,
      true,
      ''
    );
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const transferFunds = async (req, res) => {
  // transferFundsValidation
  try {
    const { pin, amount, recipientAccountTag, comment, senderTag } = req.body;

    const check = await transferFund(
      pin,
      amount,
      recipientAccountTag,
      comment,
      req.id,
      senderTag
    );

    if (check[0]) {
      return responseHandler(
        res,
        'Funds transfer successful',
        200,
        false,
        check[1]
      );
    }

    return responseHandler(
      res,
      check[1] || 'Funds transfer failed',
      400,
      true,
      ''
    );
  } catch (error) {
    return responseHandler(
      res,
      'An error occured. Try again',
      500,
      true,
      error
    );
  }
};

const setupTransactionPin = async (req, res) => {
  try {
    const check = await setPin(req.body.pin);
    if (check[0]) {
      return responseHandler(
        res,
        'Transaction pin set successfully',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(
      res,
      check[1] || 'Unable to set transaction pin',
      400,
      true,
      ''
    );
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const check = await calculateWalletBalance(req.user);


    if(!check[0]) return responseHandler(res, check[1], 400, false)

    return responseHandler(res, 'Wallet balance retrieved', 200, true, {
      balance: check[1]
    });
  } catch (error) {
    return responseHandler(
      res,
      'Unable to retrieve wallet balance',
      500,
      true,
      ''
    );
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const check = await getUserTransactions(req.id);
    if (check[0]) {
      return responseHandler(
        res,
        'Transaction history retrieved succesfully',
        200,
        false,
        check[1]
      );
    }
  } catch (error) {
    return responseHandler(
      res,
      'Unable to retrieve transaction history',
      500,
      true,
      ''
    );
  }
};

const getTransactionDetail = async (req, res) => {
  try {
    if (req.params.transactionId === undefined) {
      return responseHandler(
        res,
        'Invalid request. Include valid transaction ID',
        400,
        true,
        ''
      );
    }

    const check = await getTransaction(req.params.transactionId);
    if (check[0]) {
      return responseHandler(
        res,
        'Transaction detail retrieved succesfully',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(
      res,
      check[1] || 'Unable to retrieve transaction detail',
      404,
      true,
      ''
    );
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

const getBanksList = async (req, res) => {
  try {
    const check = await getPaystackBankLists();
    if (check[0]) {
      return responseHandler(
        res,
        'Bank list retrieved successfully',
        200,
        true,
        check[1]
      );
    }
    return responseHandler(res, 'Unable to retrieve bank list', 400, false);
  } catch (error) {
    return responseHandler(res, 'An error occurred. Try again', 500, false);
  }
};

const verifyBankAccount = async (req, res) => {
  try {
    const check = await resolveBankAccount(
      req.body.account_number,
      req.body.bank_code
    );

    if (check[0]) {
      return responseHandler(
        res,
        'Bank account details retrieved',
        200,
        true,
        check[1]
      );
    }
    return responseHandler(res, check[1], 400, false, '');
  } catch (error) {
    return responseHandler(res, 'An error occurred. Try again', 500, false, '');
  }
};

const withdrawFunds = async (req, res) => {
  try {
    const { fullName, accountNumber, bankCode, amount, reason, pin } = req.body;

    const check = await initializeTransfer(
      amount,
      reason,
      fullName,
      accountNumber,
      bankCode,
      pin,
      req.id
    );
    if (check[0]) {
      return responseHandler(
        res,
        'Withdrawal request has been queued.',
        200,
        false,
        check[1]
      );
    }
    return responseHandler(res, check[1], 400, true, '');
  } catch (error) {
    return responseHandler(res, 'An error occured. Try again', 500, true, '');
  }
};

module.exports = {
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
};
