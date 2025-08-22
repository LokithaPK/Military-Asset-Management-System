const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const { protect } = require("../middleware/authMiddleware");

// Create assignment (only admin/commander)
router.post("/", protect(["admin","commander"]), async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all assignments (admin: all, commander: base only)
router.get("/", protect(["admin","commander","logistics"]), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "commander") {
      query.base = req.query.base || ""; // restrict to commander’s base
    }
    const assignments = await Assignment.find(query);
    res.json(assignments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
