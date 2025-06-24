const express = require("express");
const { getUserActivity } = require("../controllers/activityController")
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/all", protect, getUserActivity);

module.exports = router;    