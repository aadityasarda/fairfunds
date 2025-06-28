const express = require("express");
const { createGroup, getGroupsForUser, getGroupById } = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/creategroup", protect, createGroup);

router.get("/", protect, getGroupsForUser)

router.get("/:groupId", protect, getGroupById);

module.exports = router;