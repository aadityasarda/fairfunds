const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateTokens");


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
    console.log("Current path:", __dirname);
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return created user (excluding password)
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("🔔 Login API hit");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id); // ✅ use your utility function here

    res.json({ token });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser , loginUser };
