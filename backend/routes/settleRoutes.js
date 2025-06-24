const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { settleUp } = require('../controllers/SettleController');

const router = express.Router();
router.post('/up', protect, settleUp);

module.exports = router;
