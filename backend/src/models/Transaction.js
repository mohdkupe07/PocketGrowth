const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["send", "receive"], required: true },
  originalAmount: { type: Number, required: true }, // amount sender intended
  amount: { type: Number, required: true }, // amount associated with this transaction (for receive it's the amount to be processed)
  fromUserId: { type: mongoose.Types.ObjectId, ref: "User" },
  fromUserName: { type: String },
  toUserId: { type: mongoose.Types.ObjectId, ref: "User" },
  toUserEmail: { type: String },
  toUserName: { type: String },
  isProcessed: { type: Boolean, default: false }, // whether receiver has accepted/processed the pending receive
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
