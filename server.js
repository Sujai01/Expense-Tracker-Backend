const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middlewares
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser


// // 4. CORS Setup (Crucial for MERN projects)
// app.use(cors({
//     origin: process.env.FRONT_END_URL || 'http://localhost:5173', // Vite default port
//     credentials: true
// }));

app.use(cors({
    // Allow BOTH localhost (for testing) and your future Vercel URL
    origin: ["http://localhost:5173", "expense-tracker-frontend-red-five.vercel.app"], 
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("API is running...");
});

// 5. Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));
app.use('/api/stats', require('./routes/statsRoutes')); 

// 6. Global Error Handler (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});