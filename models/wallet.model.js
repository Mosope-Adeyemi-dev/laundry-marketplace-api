const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const WalletSchema = new Schema(
  {
    transactionType: {
      type: String,
      trim: true,
      enum: ['Payment', 'Withdrawal'],
      required: true,
    },
    accessCode: { type: String },
    fundRecipientAccount: { type: ObjectId, ref: 'User' },
    fundOriginatorAccount: { type: ObjectId, ref: 'User' },
    status: {
      type: String,
      trim: true,
      default: 'pending',
      enum: ['pending', 'success', 'failed', 'abandoned'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    referenceId: { type: String, unique: true, required: true },
    bankDetails: { type: Object },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model('wallet', WalletSchema);
module.exports = Wallet;
