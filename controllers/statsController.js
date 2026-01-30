const Income = require("../models/Income");
const Expense = require("../models/Expense");
const asyncHandler = require("express-async-handler");

exports.getDashboardData = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Use Promise.all to run both queries at the same time (Performance boost!)
    const [incomes, expenses] = await Promise.all([
        Income.find({ userId }),
        Expense.find({ userId })
    ]);

    const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0);
    const totalExpense = expenses.reduce((acc, item) => acc + item.amount, 0);

    // Prepare chart data (Last 6 transactions)
    const recentHistory = [
        ...incomes.map(i => ({ date: i.date, income: i.amount, expense: 0, label: i.source })),
        ...expenses.map(e => ({ date: e.date, income: 0, expense: e.amount, label: e.category }))
    ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

    res.status(200).json({
        success: true,
        summary: {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        },
        chartData: recentHistory.reverse() // Reverse so it's chronological for the chart
    });
});