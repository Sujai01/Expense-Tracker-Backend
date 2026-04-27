const Income = require("../models/Income");
const Expense = require("../models/Expense");
const asyncHandler = require("express-async-handler");

const getDashboardData = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalIncome - totalExpense;

    // Build chart data: Group by date
    const dateMap = {};

    incomes.forEach(inc => {
        const dateStr = new Date(inc.date).toISOString().split('T')[0];
        if (!dateMap[dateStr]) dateMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
        dateMap[dateStr].income += inc.amount;
    });

    expenses.forEach(exp => {
        const dateStr = new Date(exp.date).toISOString().split('T')[0];
        if (!dateMap[dateStr]) dateMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
        dateMap[dateStr].expense += exp.amount;
    });

    // Convert map to sorted array
    const chartData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
        summary: {
            totalIncome,
            totalExpense,
            balance
        },
        chartData
    });
});

module.exports = { getDashboardData };
