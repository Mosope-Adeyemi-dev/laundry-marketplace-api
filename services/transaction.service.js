/* eslint-disable camelcase */
const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
const { getCartAmount, placeOrder } = require("../services/customer.service");
const { translateError } = require("../utils/mongo_helper");
const { v4: uuidv4 } = require("uuid");
const transactionModel = require("../models/transaction.model");
const merchantModel = require("../models/merchant.model");
const orderModel = require("../models/order.model");
const { default: mongoose } = require("mongoose");

exports.initializePaystackCheckout = async (email, userId, body) => {
  try {
    const check = await getCartAmount(userId);
    if (!check[0]) return [false, check[1]];

    if (check[1] == 0)
      return [false, "Add services to your cart to place an order"];
    const amount = check[1];

    const helper = new Paystack.FeeHelper();
    const amountPlusPaystackFees = helper.addFeesTo(amount * 100);

    const result = await Paystack.transaction.initialize({
      email,
      amount: amountPlusPaystackFees,
      reference: uuidv4(),
      currency: "NGN",
    });

    if (!result) {
      console.log(result, "error");
      return [false, "Payment service unavailable now. Try gain later."];
    }

    const checkOrder = await placeOrder(userId, body, result.data.reference);

    if (!checkOrder) return [false, check[1]];
    console.log(checkOrder[1], "placed order");

    console.log(result);

    return [true, { paymentInfo: result.data, orderId: checkOrder[1]._id }];
  } catch (error) {
    console.log(error);
    return [false, "Payment service unavailable now. Try gain later."];
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

    console.log(result);

    const { status, gateway_response } = result.data;

    const orderInfo = await orderModel.findOne({ paymentReference: reference });
    
    if (!orderInfo.isPaid) {
      const newTransaction = await transactionModel.create({
        transactionType: "payment",
        fundRecipientAccount: orderInfo.cart[0].merchantId,
        status: "success",
        amount: orderInfo.totalPrice,
        referenceId: reference
      });

      console.log(newTransaction);
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { paymentReference: reference },
      { isPaid: true },
      { new: true }
    );
    console.log(updatedOrder);

    if (!updatedOrder) return [false, "Unable to update order status"];

    return [true, { status: status, message: result.message }];
  } catch (error) {
    console.error(error);
    return [false, "Unable to verify transaction"];
  }
};


exports.calculateWalletBalance = async (id) => {
  try {
      // Transactions were the user is a fund recipient.
  const creditTransactions = await transactionModel.aggregate([
    {
      $match: { fundRecipientAccount: new mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: null,
        totalCredits: { $sum: "$amount"}
      }
    }
  ])
  //Transactions where user is fund originator
  const debitTransactions = await transactionModel.aggregate([
    {
      $match: { fundOriginatorAccount: new mongoose.Types.ObjectId(id) }
    },
    {
      $group: {
        _id: null,
        totalDebits: { $sum: "$amount"}
      }
    }
  ])

  console.log(creditTransactions, debitTransactions)

  let totalCredits = creditTransactions[0]?.totalCredits || 0;
  let totalDebits = debitTransactions[0]?.totalDebits || 0;

  console.log(totalCredits, totalDebits)

  return [true, totalCredits - totalDebits];

  } catch (error) {
    console.error(error);
    return [false, "Unable to retrieve wallet balance"];
  }
};


exports.getUserTransactions = async (id) => {
  try {
    const transactions = await transactionModel
      .find({
        $or: [{ fundRecipientAccount: id }, { fundOriginatorAccount: id }],
        // $or: [{ status: 'Success' }, { status: 'success' }],
      })
      .sort({ createdAt: -1 });
    return [true, transactions];
  } catch (error) {
    return [false, translateError(error)];
  }
};

exports.getTransaction = async (transactionId) => {
  try {
    const transaction = await transactionModel.findById(transactionId);
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
    return [false, "Failed to retrieve bank list"];
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
        const newTransaction = new transactionModel({
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
