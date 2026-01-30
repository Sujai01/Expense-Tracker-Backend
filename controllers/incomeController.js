const Income = require("../models/Income.js");
const asyncHandler = require("express-async-handler");
const XLSX = require("xlsx");

// @desc    Add new income
// @route   POST /api/income/add
exports.addIncome = asyncHandler(async (req, res) => {
    const { source, amount, date, icon, category, description } = req.body;

    // Simple validation check
    if (!source || !amount || !date) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }

    const income = await Income.create({
        userId: req.user.id, // Comes from auth middleware
        source,
        amount,
        date,
        icon,
        category,
        description
    });

    res.status(201).json({ success: true, data: income });
});

// @desc    Get all income for logged in user (with sorting)
// @route   GET /api/income/all
exports.getAllIncome = asyncHandler(async (req, res) => {
    // We sort by date (newest first)
    const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    
    res.status(200).json({
        success: true,
        count: incomes.length,
        data: incomes
    });
});

// @desc    Delete income
// @route   DELETE /api/income/:id
exports.deleteIncome = asyncHandler(async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        res.status(404);
        throw new Error("Income record not found");
    }

    // Security: Ensure user owns this record
    if (income.userId.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }

    await income.deleteOne();
    res.status(200).json({ success: true, message: "Record removed" });
});

// @desc    Export data to Excel (High-value CV feature)
// @route   GET /api/income/download
exports.downloadIncomeExcel = asyncHandler(async (req, res) => {
    const incomes = await Income.find({ userId: req.user.id }).lean();

    // Clean data for Excel
    const data = incomes.map(item => ({
        "Date": new Date(item.date).toLocaleDateString(),
        "Source": item.source,
        "Amount ($)": item.amount,
        "Category": item.category || "Salary",
        "Description": item.description || "N/A"
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");

    // Create Buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=Incomes.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});