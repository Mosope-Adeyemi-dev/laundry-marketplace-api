/* eslint-disable camelcase */
const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const { translateError } = require("../utils/mongo_helper");
const { v4: uuidv4 } = require("uuid");
const walletModel = require("../models/wallet.model");
const merchantModel = require("../models/merchant.model");

exports.storeTransaction = async (
  referenceId,
  transactionType,
  operationType,
  amount,
  fundRecipientAccount,
  accessCode
) => {
  const newTransaction = new walletModel({
    referenceId,
    transactionType,
    operationType,
    amount,
    fundRecipientAccount,
    accessCode,
  });

  if (await newTransaction.save()) {
    return [true, newTransaction];
  }
  return [false];
};

exports.setPin = async (pin) => {
  const updatedUser = await merchantModel
    .findOneAndUpdate({ email: this.email }, { pin }, { new: true })
    .select("pin");

  if (updatedUser) {
    return [true, updatedUser];
  }
  return [false];
};

exports.updateTransaction = async (
  referenceId,
  status,
  processingFees,
  authorization
) => {
  const updatedTransaction = await walletModel.findOneAndUpdate(
    { referenceId },
    { status, processingFees, authorization },
    { new: true }
  );

  if (updatedTransaction) {
    return updatedTransaction;
  }
  return null;
};

exports.initializePaystackCheckout = async (amount, userId) => {
  const helper = new Paystack.FeeHelper();
  const amountPlusPaystackFees = helper.addFeesTo(amount * 100);
  // const splitAccountFees = (1 / 100) * amount * 100;

  const result = await Paystack.transaction.initialize({
    email: this.email,
    //If amount is less than NGN2500, waive paystack's NGN100 charge to NGN10
    amount: amountPlusPaystackFees,
      // amount >= 2500
      //   ? Math.ceil(amountPlusPaystackFees + 15000 + splitAccountFees)
      //   : Math.ceil(amountPlusPaystackFees + 1000 + splitAccountFees),
    reference: uuidv4(),
    currency: "NGN",
    // subaccount: process.env.PAYSTACK_SUB_ACCT,
  });

  if (!result) {
    return [false, result];
  }

  const newTransaction = await wallet
  if (newTransaction) {
    return [true, result.data];
  }
};

exports.verifyTransaction = async (reference) => {
  try {
    const result = await Paystack.transaction.verify({
      reference,
    });
    if (!result) {
      return [false];
    }

    const { paystack, subaccount } = result.data.fees_split;
    const totalProcessingFees = paystack + subaccount;

    const updatedTransaction = await updateTransaction(
      reference,
      result.data.status,
      totalProcessingFees,
      result.data.authorization
    );

    if (updatedTransaction) {
      return [true, updatedTransaction];
    }

    return [false];
  } catch (error) {
    return [false];
  }
};

exports.transferFund = async (
  pin,
  amount,
  fundRecipientAccountTag,
  comment,
  fundOriginatorAccount,
  senderTag
) => {
  const foundRecipient = await merchantModel
    .findOne({
      username: fundRecipientAccountTag,
    })
    .select("username");
  if (!foundRecipient) {
    return [false, "Invalid recipient account"];
  }

  if (
    (await this.calculateWalletBalance(fundOriginatorAccount)) <=
    Number(amount) + 100
  ) {
    return [false, "Error - Insufficient funds"];
  }

  if (await validatePin(pin, fundOriginatorAccount)) {
    // include step to validate user balance!!!

    const newTransaction = new walletModel({
      fundRecipientAccount: foundRecipient._id,
      fundOriginatorAccount,
      amount,
      operationType: "Debit",
      transactionType: "Transfer",
      status: "Success",
      referenceId: uuidv4(),
      comment,
      recepientTag: fundRecipientAccountTag,
      senderTag,
    });

    if (await newTransaction.save()) {
      return [true, newTransaction];
    }
    return [false, "Error - Unable to process transfer"];
  } else {
    return [false, "Error - Incorrect transaction pin"];
  }
};

exports.calculateWalletBalance = async (id) => {
  // Transactions were the user is a fund recipient.
  const recipientTransactons = await walletModel.find({
    fundRecipientAccount: id,
  });
  //Transactions where user is fund originator
  const originatorTransactions = await walletModel.find({
    fundOriginatorAccount: id,
  });

  let totalCredits = 0.0;
  let totalDebits = 0.0;

  if (recipientTransactons && originatorTransactions) {
    recipientTransactons.forEach((transaction) => {
      if (transaction.status === "success" || transaction.status === "Success")
        totalCredits = totalCredits + transaction.amount;
    });
    originatorTransactions.forEach((transaction) => {
      if (transaction.status === "success" || transaction.status === "Success")
        totalDebits = totalDebits + transaction.amount;
    });
  }
  return totalCredits - totalDebits;
};

exports.validatePin = async (formPin, id) => {
  const foundUser = await merchantModel.findById(id).select("pin");
  if (foundUser.pin === formPin) {
    return true;
  }
  return false;
};

exports.getUserTransactions = async (id) => {
  try {
    const transactions = await walletModel.find({
      $or: [{ fundRecipientAccount: id }, { fundOriginatorAccount: id }],
      // $or: [{ status: 'Success' }, { status: 'success' }],
    }).sort({ createdAt: -1 });
    return [true, transactions];
  } catch (error) {
    return [false, translateError(error)];
  }
};

exports.getTransaction = async (transactionId) => {
  try {
    const transaction = await walletModel.findById(transactionId);
    if (transaction) {
      return [true, transaction];
    }
    return [false, "Transaction not found"];
  } catch (error) {
    return [false, translateError(error)];
  }
};

exports.getPaystackBankLists = async () => {
  try {
    const banks = await Paystack.misc.list_banks({
      country: "nigeria",
      use_cursor: true,
      perPage: 100,
    });
    if (banks) {
      return [true, banks.data];
    }
    return [false];
  } catch (error) {
    return [false, error.error.message];
  }
};

exports.resolveBankAccount = async (account_number, bank_code) => {
  try {
    const accountDetails = await Paystack.verification.resolveAccount({
      account_number,
      bank_code,
    });
    if (accountDetails) {
      return [true, accountDetails.data];
    }
    return [false];
  } catch (error) {
    return [false, error.error.message];
  }
};

exports.createTransferRecipient = async (
  fullName,
  account_number,
  bank_code
) => {
  try {
    const recipient = await Paystack.transfer_recipient.create({
      type: "nuban",
      name: fullName,
      account_number,
      bank_code,
      currency: "NGN",
    });
    if (recipient) {
      return [true, recipient.data];
    }
  } catch (error) {
    return [false, error.error.message];
  }
};

exports.initializeTransfer = async (
  amount,
  reason,
  fullName,
  account_number,
  bank_code,
  pin,
  userId
) => {
  try {
    // Create transaction recipient
    const check = await createTransferRecipient(
      fullName,
      account_number,
      bank_code
    );

    //if transaction recipient is created
    if (check[0]) {
      //Validate transaction pin
      if (!(await validatePin(pin, userId))) {
        return [false, "Error - Incorrect transaction pin"];
      }

      //check if user has sufficient founds
      if ((await this.calculateWalletBalance(userId)) <= Number(amount) + 100) {
        return [false, "Error - Insufficient funds"];
      }

      //Initiate paystack transfer request
      const withdrawRequest = await Paystack.transfer.create({
        source: "balance",
        amount: Number(amount) * 100 + 15 * 100, //Charge an extra 15 naira for processing fee.
        recipient: check[1].recipient_code,
        reason,
      });
      if (withdrawRequest) {
        //Create trasaction record on DB
        const newTransaction = new walletModel({
          transactionType: "Withdrawal",
          referenceId: withdrawRequest.data.reference,
          operationType: "Debit",
          status: "Success",
          processingFees: 15 * 100,
          amount: Number(amount) + 15,
          comment: reason,
          fundOriginatorAccount: userId,
          bankDetails: check[1].details,
        });
        if (await newTransaction.save()) {
          return [true, newTransaction];
          // return [true, withdrawRequest.data];
        }
        return [false, "Error - unable to process withdraw request"];
      }
    } else {
      return [false, check[1] || "Unable to resolve account number"];
    }
  } catch (error) {
    return [false, error.error.message || error];
  }
};