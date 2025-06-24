const Invite = require('../models/Invite');
const User = require('../models/User');
const Group = require('../models/Group');

const inviteUser = async (req, res) => {
  const { groupId, email } = req.body;

  if (!groupId || !email) {
    return res.status(400).json({ message: 'Group ID and email are required' });
  }

  try {
    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existing = await Invite.findOne({
      groupId,
      invitedUserId: userToInvite._id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({ message: 'User already invited to this group' });
    }

    const newInvite = await Invite.create({
      groupId,
      invitedUserId: userToInvite._id,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Invitation sent', invite: newInvite });
  } catch (err) {
    console.error('❌ Error sending invite:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyInvites = async (req, res) => {
  try {
    const invites = await Invite.find({
      invitedUserId: req.user._id,
      status: 'pending',
    })
    .populate('groupId', 'name') // include group name
    .populate('createdBy', 'email'); // include inviter's email

    res.json(invites);
  } catch (err) {
    console.error("❌ Error getting invites:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptInvite = async (req, res) => {
  const { inviteId } = req.body;

  if (!inviteId) {
    return res.status(400).json({ message: 'Invite ID is required' });
  }

  try {
    const invite = await Invite.findById(inviteId);

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found' });
    }

    if (!invite.invitedUserId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to accept this invite' });
    }

    if (invite.status !== 'pending') {
      return res.status(400).json({ message: `Invite is already ${invite.status}` });
    }

    // Add user to group if not already a member
    await Group.findByIdAndUpdate(invite.groupId, {
      $addToSet: { members: req.user._id } // avoids duplicates
    });

    invite.status = 'accepted';
    await invite.save();

    res.json({ message: 'Invite accepted successfully' });
  } catch (error) {
    console.error("❌ Error accepting invite:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { inviteUser, getMyInvites, acceptInvite};
