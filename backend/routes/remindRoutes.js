const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendReminder,
  getRemindersForUser,
  getUnseenCount
} = require('../controllers/reminderController');

const router = express.Router();

router.post('/send', protect, sendReminder);
router.get('/my', protect, getRemindersForUser);
router.get('/unseen-count', protect, getUnseenCount);

module.exports = router;