const Expense = require("../models/Expense");
const User = require("../models/User");
const Group = require("../models/Group");
const Settlement = require('../models/Settle');

const addExpense = async (req, res) => {
  let { description, amount, paidBy, splitBetween, splitType, groupId } = req.body;

  if (
    !description ||
    isNaN(Number(amount)) ||
    !paidBy ||
    !groupId ||
    !Array.isArray(splitBetween) ||
    splitBetween.length === 0 ||
    !splitType
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const payer = await User.findById(paidBy);
    if (!payer) {
      return res.status(404).json({ message: "Payer user not found" });
    }

    const users = await User.find({ _id: { $in: splitBetween } });
    if (users.length !== splitBetween.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }

    const expense = await Expense.create({
      description,
      amount: parseFloat(amount),
      paidBy: payer._id,
      groupId,
      splitBetween: users.map(u => u._id),
      splitType,
    });


    res.status(201).json(expense);
  } catch (error) {
    console.error("Add Expense Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getExpensesByGroup = async (req, res) => {
  const groupId = req.params.groupId;

  if (!groupId) {
    return res.status(400).json({ message: "GroupId is required" });
  }

  try {
    const expenses = await Expense.find({ groupId: groupId })
      .populate("paidBy", "name email")
      .populate("splitBetween", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { description, amount, paidBy, splitBetween, splitType, shares, unequalMode } = req.body;

  if (!description || isNaN(amount) || !paidBy || !Array.isArray(splitBetween)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      {
        description,
        amount: parseFloat(amount),
        paidBy,
        splitBetween,
        splitType,
        shares: splitType === "unequal" ? shares : {},
        unequalMode: splitType === "unequal" ? unequalMode : '',
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }


    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    const paidBy = expense.paidBy.toString();
    const involved = expense.splitBetween.map(id => id.toString());

    await Expense.findByIdAndDelete(req.params.expenseId);

    await Settlement.updateMany(
      {
        $or: [
          { from: { $in: [paidBy, ...involved] }, to: { $in: [paidBy, ...involved] } },
          { to: { $in: [paidBy, ...involved] }, from: { $in: [paidBy, ...involved] } }
        ]
      },
      { $set: { isOrphaned: true } }
    );

    res.status(200).json({ message: 'Expense deleted and related settlements marked as orphaned' });
  } catch (err) {
    console.error('deleteExpense error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id)
      .populate('paidBy', 'name email')
      .populate('splitBetween', 'name email');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error('getExpenseById error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllUserExpensesWithDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const groups = await Group.find({ members: userId });
    const groupIds = groups.map(g => g._id);

    const expenses = await Expense.find({ groupId: { $in: groupIds } })
      .populate('paidBy', '_id name')
      .populate('splitBetween', '_id name')
      .sort({ createdAt: 1 });

    res.status(200).json({ expenses });
  } catch (err) {
    console.error("getAllUserExpensesWithDetails failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllExpensesForUser = async (req, res) => {
  const userId = req.user.id.toString();

  try {
    const groups = await Group.find({ members: userId });
    const groupIds = groups.map(g => g._id);

    const expenses = await Expense.find({ groupId: { $in: groupIds } })
      .populate("paidBy", "_id name")
      .populate("splitBetween", "_id name");

    const balances = {};
    const seen = new Set();
    const validUserPairs = new Set();
    const involvedUsers = new Set();

    const add = (from, to, amt) => {
      from = from.toString();
      to = to.toString();
      if (from === to || amt === 0) return;
      if (!balances[from]) balances[from] = {};
      balances[from][to] = (balances[from][to] || 0) + amt;
    };

    for (const exp of expenses) {
      const paidBy = exp.paidBy._id.toString();
      const splitUsers = exp.splitBetween.map(u => u._id.toString());
      const share = exp.amount / splitUsers.length;

      for (const uid of splitUsers) {
        if (uid !== paidBy) {
          add(uid, paidBy, share);
          validUserPairs.add(`${uid}-${paidBy}`);
          validUserPairs.add(`${paidBy}-${uid}`);
          involvedUsers.add(uid);
          involvedUsers.add(paidBy);
        }
      }
    }

    const settlements = await Settlement.find({ isOrphaned: false });
    for (const s of settlements) {
      const from = s.from.toString();
      const to = s.to.toString();
      const key = `${from}-${to}`;
      if (!validUserPairs.has(key)) {
        console.log("Skipping orphan settlement (no matching expense):", key);
        continue;
      }
      add(from, to, -s.amount);
    }

    const netBalances = {};
    for (const from in balances) {
      for (const to in balances[from]) {
        const key = `${from}-${to}`;
        const reverseKey = `${to}-${from}`;
        if (seen.has(key) || seen.has(reverseKey)) continue;

        const forward = balances[from]?.[to] || 0;
        const reverse = balances[to]?.[from] || 0;
        const net = forward - reverse;

        if (Math.abs(net) <= 0.01) continue;

        if (net > 0) {
          netBalances[key] = { from, to, amount: net };
        } else {
          netBalances[reverseKey] = { from: to, to: from, amount: -net };
        }

        seen.add(key);
        seen.add(reverseKey);
        involvedUsers.add(from);
        involvedUsers.add(to);
      }
    }

    const result = Object.values(netBalances).filter(
      b => b.from === userId || b.to === userId
    );

    const members = await User.find({
      _id: { $in: Array.from(involvedUsers) }
    }).select("_id name");

    res.status(200).json({ balances: result, members });
  } catch (err) {
    console.error("🔥 getAllExpensesForUser failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { addExpense, getExpensesByGroup, updateExpense, deleteExpense, getExpenseById, getAllExpensesForUser, getAllUserExpensesWithDetails };
