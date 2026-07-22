const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["stocks", "crypto", "mutual_funds", "real_estate", "bonds", "other"],
      required: true,
    },
    amount: { type: Number, required: true },
    returns: { type: Number, default: 0 }, // can be negative for loss
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);
