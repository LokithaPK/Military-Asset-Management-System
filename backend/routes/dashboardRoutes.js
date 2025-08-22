const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const Transfer = require("../models/Transfer");
const Assignment = require("../models/Assignment");
const { protect } = require("../middleware/authMiddleware");

// GET /api/dashboard
router.get("/", protect(["admin","commander","logistics"]), async (req, res) => {
  try {
    const role = req.user.role;
    let baseFilter = {};
    
    // Commander sees only their base
    if (role === "commander") {
      baseFilter.base = req.query.base || ""; // commander base
    }

    // Purchases
    const purchases = await Purchase.find(baseFilter);
    const totalPurchased = purchases.reduce((sum, p) => sum + p.quantity, 0);

    // Transfers In & Out
    const transfers = await Transfer.find(baseFilter);
    let transferIn = 0, transferOut = 0;
    transfers.forEach(t => {
      if (t.toBase === baseFilter.base) transferIn += t.quantity;
      if (t.fromBase === baseFilter.base) transferOut += t.quantity;
    });

    // Assignments & Expended
    const assignments = await Assignment.find(baseFilter);
    const assigned = assignments.length;
    const expended = assignments.filter(a => a.expended).length;

    const netMovement = totalPurchased + transferIn - transferOut;
    const openingBalance = totalPurchased + transferIn - transferOut - assigned;
    const closingBalance = openingBalance - expended;

    res.json({
  openingBalance,
  closingBalance,
  netMovement,
  assigned,
  expended,
  breakdown: {
    totalPurchased,
    transferIn,
    transferOut
  }
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
