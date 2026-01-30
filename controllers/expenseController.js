const Expense = require("../models/Expense.js");
const asyncHandler = require("express-async-handler");
const XLSX = require("xlsx");

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = asyncHandler(async (req, res) => {
    const { category, amount, date, icon, description } = req.body;

    // 1. Validation check
    if (!category || !amount || !date) {
        res.status(400);
        throw new Error("Category, amount, and date are required");
    }

    // 2. Create the record (userId comes from 'protect' middleware)
    const expense = await Expense.create({
        userId: req.user.id,
        category,
        amount,
        date,
        icon,
        description
    });

    res.status(201).json({ success: true, data: expense });
});

// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
// @access  Private
exports.getAllExpenses = asyncHandler(async (req, res) => {
    // Sort by date descending (newest first)
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

    res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
    });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error("Expense record not found");
    }

    // SECURITY: Ensure the logged-in user owns the record they are trying to delete
    if (expense.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized to delete this record");
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: "Expense removed successfully" });
});

// @desc    Export expenses to Excel file
// @route   GET /api/expenses/download
// @access  Private
exports.downloadExpenseExcel = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.id }).lean();

    if (expenses.length === 0) {
        res.status(404);
        throw new Error("No data available to export");
    }

    // Map data to clean column headers for the Excel sheet
    const data = expenses.map(item => ({
        "Date": new Date(item.date).toLocaleDateString(),
        "Category": item.category,
        "Amount ($)": item.amount,
        "Description": item.description || "N/A"
    }));

    // Generate Excel logic
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // Write to a buffer so we can send it as a download
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=MyExpenses.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});