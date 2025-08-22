const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// POST /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Ensure role is valid
  if (!["admin","commander","logistics"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ error: "User already exists" });

  const user = await User.create({ name, email, password, role });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } else {
    res.status(400).json({ error: "Invalid user data" });
  }
});

module.exports = router;
