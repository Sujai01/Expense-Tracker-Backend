const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        source: {
            type: String,
            required: [true, "Please add an income source"],
        },
        amount: {
            type: Number,
            required: [true, "Please add an amount"],
        },
        date: {
            type: Date,
            required: [true, "Please add a date"],
        },
        category: {
            type: String,
            default: "Salary",
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

module.exports = mongoose.model("Income", incomeSchema);
