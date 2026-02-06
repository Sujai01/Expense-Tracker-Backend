const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();

const app = express();

// 1. IMPORTANT: Health Check Route for Render
// Place this BEFORE other routes. Render pings this to see if the app is alive.
app.get('/', (req, res) => {
    res.status(200).send("Expense Tracker API is Live and Healthy");
});

// 2. Connect to Database (Don't let it block the server start)
connectDB();

// 3. Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false, // Allows images to load in production
}));
app.use(morgan('dev'));
app.use(express.json());

// 4. CORS Setup
// Replace the URL with your actual Vercel link
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://expense-tracker-frontend-five.vercel.app", // Example Vercel URL
        /\.vercel\.app$/ // Matches any vercel sub-domain
    ],
    credentials: true
}));

// 5. Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/expense', require('./routes/expenseRoutes'));
app.use('/api/stats', require('./routes/statsRoutes')); 

// 6. Global Error Handler
app.use(errorHandler);

// 7. PORT Logic (Render provides the port automatically)
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});