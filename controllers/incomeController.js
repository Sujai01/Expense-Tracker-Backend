const Income = require("../models/Income");
const asyncHandler = require("express-async-handler");
const xlsx = require("xlsx");

const addIncome = asyncHandler(async (req, res) => {
    const { source, amount, date, category, description } = req.body;

    if (!source || !amount || !date) {
        res.status(400);
        throw new Error("Please add all required fields");
    }

    const income = await Income.create({
        userId: req.user.id,
        source,
        amount,
        date,
        category,
        description,
    });

    res.status(201).json({ success: true, data: income });
});

const getAllIncome = asyncHandler(async (req, res) => {
    const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, data: incomes });
});

const deleteIncome = asyncHandler(async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        res.status(404);
        throw new Error("Income record not found");
    }

    if (income.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await income.deleteOne();
    res.status(200).json({ success: true, message: "Income deleted" });
});

const downloadIncomeExcel = asyncHandler(async (req, res) => {
    const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });

    const data = incomes.map(item => ({
        Source: item.source,
        Amount: item.amount,
        Date: new Date(item.date).toLocaleDateString(),
        Category: item.category,
        Description: item.description || "N/A"
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.set({
        "Content-Disposition": "attachment; filename=Incomes_Report.xlsx",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    res.status(200).send(buffer);
});

module.exports = { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };
