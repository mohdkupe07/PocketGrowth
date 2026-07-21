const express = require("express");
const Investment = require("../models/Investment");
const User = require("../models/User");

const router = express.Router();

// ✅ POST /api/investments/add
router.post("/add", async (req, res) => {
  try {
    const { userId, type, amount, returns } = req.body;

    if (!userId || !type || !amount)
      return res.status(400).json({ error: "Missing required fields" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const investAmount = parseFloat(amount);

    // ✅ Check for sufficient balance
    if (user.availableBalance < investAmount) {
      return res.status(400).json({ error: "Insufficient balance to invest" });
    }

    // ✅ Deduct the invested amount from user's available balance
    user.availableBalance -= investAmount;
    await user.save();

    // ✅ Create a new investment entry
    const newInvestment = new Investment({
      userId,
      type,
      amount: investAmount,
      returns: returns || 0, // returns remain 0 for now
      createdAt: new Date(),
    });

    await newInvestment.save();

    res.status(201).json({
      message: `✅ Invested $${investAmount} in ${type}`,
      investment: newInvestment,
      newBalance: user.availableBalance,
    });
  } catch (error) {
    console.error("Add investment error:", error);
    res.status(500).json({ error: "Failed to add investment" });
  }
});

// ✅ GET /api/investments/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const investments = await Investment.find({ userId }).sort({ createdAt: -1 });

    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);
    const netWorth = totalInvested + totalReturns;

    res.json({
      totalInvested,
      totalReturns,
      netWorth,
      investments,
    });
  } catch (error) {
    console.error("Fetch investments error:", error);
    res.status(500).json({ error: "Failed to fetch investments" });
  }
});


router.patch("/grow", async (req, res) => {
  try {
    const investments = await Investment.find();

    for (const inv of investments) {
      // Simulate a random return between -2% and +5%
      const growthRate = Math.random() * 0.07 - 0.02;
      const gain = inv.amount * growthRate;
      inv.returns = (inv.returns || 0) + gain;
      await inv.save();
    }

    res.json({ message: "📈 Investments updated with simulated returns" });
  } catch (error) {
    console.error("Growth error:", error);
    res.status(500).json({ error: "Failed to update investments" });
  }
});


module.exports = router;
