const express = require('express');
const router = express.Router();
const { addExpense, getAllExpenses, deleteExpense, downloadExpenseExcel } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected by the auth middleware
router.post('/add', protect, addExpense);
router.get('/get', protect, getAllExpenses);
router.delete('/:id', protect, deleteExpense);
router.get('/download', protect, downloadExpenseExcel);

module.exports = router;