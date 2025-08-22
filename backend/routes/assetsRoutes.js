const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const Transfer = require("../models/Transfer");
const Assignment = require("../models/Assignment");
const { protect } = require("../middleware/authMiddleware");

// GET /api/assets
router.get("/", protect(["admin","commander","logistics"]), async (req, res) => {
  try {
    const role = req.user.role;
    let baseFilter = {};
    
    if (role === "commander") {
      baseFilter.base = req.query.base || ""; // restrict to commander’s base
    }

    // Aggregate purchases per asset per base
    const purchases = await Purchase.find(baseFilter);
    const transfers = await Transfer.find({});
    const assignments = await Assignment.find(baseFilter);

    // Assets dictionary: { "Base-Asset": quantity }
    const assets = {};

    // Add purchases
    purchases.forEach(p => {
      const key = `${p.base}-${p.asset}`;
      assets[key] = (assets[key] || 0) + p.quantity;
    });

    // Add transfers in/out
    transfers.forEach(t => {
      // Transfer out
      const outKey = `${t.fromBase}-${t.asset}`;
      assets[outKey] = (assets[outKey] || 0) - t.quantity;
      // Transfer in
      const inKey = `${t.toBase}-${t.asset}`;
      assets[inKey] = (assets[inKey] || 0) + t.quantity;
    });

    // Subtract assigned assets
    assignments.forEach(a => {
      const key = `${a.base}-${a.asset}`;
      assets[key] = (assets[key] || 0) - 1; // assuming one per assignment
    });

    // Format output
    const result = Object.keys(assets).map(key => {
      const [base, asset] = key.split("-");
      return { base, asset, quantity: assets[key] };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
