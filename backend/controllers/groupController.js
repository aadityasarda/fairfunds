const Group = require("../models/Group");
const User = require("../models/User")

const getGroupsForUser = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (err) {
    console.error("❌ Error in getGroupsForUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createGroup = async (req, res) => {
  const { name, members = [] } = req.body;
  console.log("🔥 Create group request:", { name, members });

  if (!name) {
    return res.status(400).json({ message: "Group name is required" });
  }

  try {
    const creatorId = req.user._id.toString();
    console.log("👤 Creator ID:", creatorId);

    const uniqueMembers = Array.from(new Set([...members, creatorId]));
    console.log("🧾 Unique Members:", uniqueMembers);

    const validUsers = await User.find({ _id: { $in: uniqueMembers } });
    console.log("✅ Valid Users Found:", validUsers.length);

    if (validUsers.length !== uniqueMembers.length) {
      return res.status(400).json({ message: "One or more members do not exist." });
    }

    const group = await Group.create({
      name,
      members: uniqueMembers,
      createdBy: req.user._id,
    });

    console.log("🎉 Group created:", group);
    res.status(200).json(group);
  } catch (error) {
    console.error("❌ Group creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getGroupById = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('members', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('❌ Error in getGroupById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createGroup, getGroupsForUser, getGroupById };
