const express = require('express');
const { inviteUser, getMyInvites, acceptInvite } = require('../controllers/inviteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', protect, inviteUser); // POST /api/invites/send
router.get('/me', protect, getMyInvites);
router.post('/accept', protect, acceptInvite);

module.exports = router;
