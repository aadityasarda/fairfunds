// ✅ models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    splitBetween: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    splitType: {
      type: String,
      enum: ['equal', 'unequal'],
      default: 'equal',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
