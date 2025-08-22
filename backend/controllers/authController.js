const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  console.log("Registration attempt with body:", req.body);
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      console.log("Missing required fields");
      return res.status(400).json({ 
        error: "All fields are required",
        received: { name, email, role, passwordProvided: !!password }
      });
    }
    console.log("Creating user with:", { name, email, role });
    const user = await User.create({ name, email, password, role });
    console.log("User created successfully:", user._id);
    // Create JWT after successful registration
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ 
      error: err.message,
      details: err.errors || err
    });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
