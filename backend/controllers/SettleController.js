const Settlement = require('../models/Settle');
const User = require('../models/User');

const settleUp = async (req, res) => {
  const { toUserId, amount } = req.body;
  const fromUserId = req.user.id;

  if (!toUserId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    const settle = await Settlement.create({
      from: fromUserId,
      to: toUserId,
      amount,
      settledAt: new Date()
    });

    res.status(201).json(settle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { settleUp };