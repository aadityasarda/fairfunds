const Activity = require('../models/Activity');

const getUserActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('groupId', 'name')
      .limit(50);

    res.status(200).json(activities);
  } catch (err) {
    console.error('Activity fetch failed:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getUserActivity };
