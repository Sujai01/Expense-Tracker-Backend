const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, "User ID is required"],
        index: true // Optimized for faster searching
    },
    icon: { type: String, default: "💰" },
    source: { 
        type: String, 
        required: [true, "Source is required"],
        trim: true 
    },
    category: { type: String, default: "Salary" }, // Added for better filtering
    amount: { 
        type: Number, 
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"]
    },
    date: { type: Date, required: true },
    description: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);