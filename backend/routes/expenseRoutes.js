const express = require("express");
const { addExpense, getExpensesByGroup, updateExpense, deleteExpense, getExpenseById, getAllExpensesForUser, getAllUserExpensesWithDetails } = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/group/:groupId", protect, getExpensesByGroup);
router.put("/:expenseId", protect, updateExpense);
router.get("/:id", protect, getExpenseById);
router.delete("/:expenseId", deleteExpense);
router.get("/user/all", protect, getAllExpensesForUser);
router.get("/user/activities", protect, getAllUserExpensesWithDetails);

module.exports = router