const Reminder = require('../models/Reminder');

const sendReminder = async (req, res) => {
  const from = req.user.id;
  const { to, message } = req.body;

  if (!to) return res.status(400).json({ message: "Recipient is required" });

  try {
    const reminder = await Reminder.create({
      from,
      to,
      message: message || 'Please settle up.'
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getRemindersForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const reminders = await Reminder.find({ to: userId })
      .populate('from', 'name email')
      .sort({ createdAt: -1 });

    await Reminder.updateMany({ to: userId, seen: false }, { seen: true });

    res.status(200).json({ reminders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUnseenCount = async (req, res) => {
  try {
    const count = await Reminder.countDocuments({ to: req.user.id, seen: false });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Failed to get reminder count" });
  }
};

module.exports = {
  sendReminder,
  getRemindersForUser,
  getUnseenCount
};
