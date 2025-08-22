const express = require("express");
const router = express.Router();
const Transfer = require("../models/Transfer");
const { protect } = require("../middleware/authMiddleware");

// Create transfer (Admin / Logistics)
router.post("/", protect(["admin","logistics"]), async (req, res) => {
  try {
    const transfer = await Transfer.create(req.body);
    res.status(201).json(transfer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transfers
router.get("/", protect(["admin","logistics"]), async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
