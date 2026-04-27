const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        category: {
            type: String,
            required: [true, "Please add an expense category"],
        },
        amount: {
            type: Number,
            required: [true, "Please add an amount"],
        },
        date: {
            type: Date,
            required: [true, "Please add a date"],
        },
        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Expense", expenseSchema);
