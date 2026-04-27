const Expense = require("../models/Expense");
const asyncHandler = require("express-async-handler");
const xlsx = require("xlsx");

const addExpense = asyncHandler(async (req, res) => {
    const { category, amount, date, description } = req.body;

    if (!category || !amount || !date) {
        res.status(400);
        throw new Error("Please add all required fields");
    }

    const expense = await Expense.create({
        userId: req.user.id,
        category,
        amount,
        date,
        description,
    });

    res.status(201).json({ success: true, data: expense });
});

const getAllExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
});

const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error("Expense record not found");
    }

    if (expense.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: "Expense deleted" });
});

const downloadExpenseExcel = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

    const data = expenses.map(item => ({
        Category: item.category,
        Amount: item.amount,
        Date: new Date(item.date).toLocaleDateString(),
        Description: item.description || "N/A"
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.set({
        "Content-Disposition": "attachment; filename=Expense_Report.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    res.status(200).send(buffer);
});

module.exports = { addExpense, getAllExpenses, deleteExpense, downloadExpenseExcel };
