const Joi = require('joi');

const v_fundWalletValidation = Joi.object({
  amount: Joi.number().required(),
});

const v_transferFundsValidation = Joi.object({
  pin: Joi.string().min(4).max(4).required(),
  amount: Joi.number().required(),
  comment: Joi.string(),
  recipientAccountTag: Joi.string().min(5).required(),
  senderTag: Joi.string().min(5).required(),
});

const v_setPinValidation = Joi.object({
  pin: Joi.string().min(4).max(4).required(),
  confirmPin: Joi.ref('pin'),
});

const v_verifyBankAccountValidation = Joi.object({
  bank_code: Joi.string().required(),
  account_number: Joi.string().required(),
});

const v_withdrawValidation = Joi.object({
  fullName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  bankCode: Joi.string().required(),
  pin: Joi.string().min(4).max(4).required(),
  reason: Joi.string(),
  amount: Joi.number().required(),
});

module.exports = {
  v_fundWalletValidation,
  v_transferFundsValidation,
  v_setPinValidation,
  v_verifyBankAccountValidation,
  v_withdrawValidation,
};
