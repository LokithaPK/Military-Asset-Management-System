const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const { protect } = require("../middleware/authMiddleware");

// Create purchase (Admin / Logistics)
router.post("/", protect(["admin","logistics"]), async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all purchases
router.get("/", protect(["admin","logistics"]), async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
