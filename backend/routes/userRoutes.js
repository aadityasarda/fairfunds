const express = require("express");
const { registerUser , loginUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware")
const User = require('../models/User')

const router = express.Router();

// Route: POST /api/users/register
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email');
  res.json(user);
});

module.exports = router;
