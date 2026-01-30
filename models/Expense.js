const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, "User ID is required"],
        index: true // Faster queries for dashboard stats
    },
    icon: { 
        type: String, 
        default: "🛒" 
    },
    category: { 
        type: String, 
        required: [true, "Category is required"],
        trim: true 
    },
    amount: { 
        type: Number, 
        required: [true, "Amount is required"],
        min: [0, "Expense cannot be negative"]
    },
    date: { 
        type: Date, 
        required: [true, "Date is required"] 
    },
    description: { 
        type: String, 
        trim: true,
        maxLength: [100, "Description cannot exceed 100 characters"]
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);