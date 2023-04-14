const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      trim: true,
      enum: ['payment', 'withdrawal'],
      required: true,
    },
    // accessCode: { type: String },
    fundRecipientAccount: { type: ObjectId, ref: 'Merchant' },
    fundOriginatorAccount: { type: ObjectId, ref: 'Merchant' },
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
    referenceId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('transaction', TransactionSchema);
module.exports = Transaction;
