const express = require("express");
const User = require("../models/User");
const router = express.Router();

// POST /api/allowance/add
router.post("/add", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const numAmount = Number(amount);

    if (!userId || !numAmount || numAmount <= 0)
      return res.status(400).json({ error: "Invalid request data" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const savingsPercent = user.savingsPercent || 20;
    const savingsAmount = (numAmount * savingsPercent) / 100;
    const spendable = numAmount - savingsAmount;

    // Update balances
    user.availableBalance += spendable;
    user.lockedBalance += savingsAmount;
    await user.save();

    res.json({
      message: `✅ Added $${numAmount} — saved $${savingsAmount} (${savingsPercent}%) automatically.`,
      availableBalance: user.availableBalance,
      lockedBalance: user.lockedBalance,
    });
  } catch (error) {
    console.error("Add allowance error:", error);
    res.status(500).json({ error: "Failed to add allowance" });
  }
});

module.exports = router;
