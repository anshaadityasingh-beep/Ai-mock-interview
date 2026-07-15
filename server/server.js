// Load environment variables at the very top
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const interviewRoutes = require('./routes/interview.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const problemLogRoutes = require('./routes/problemLog.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
let clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
if (clientUrl.endsWith('/')) {
  clientUrl = clientUrl.slice(0, -1);
}

app.use(cors({
  origin: [clientUrl, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/problems', problemLogRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Mock Interview Simulator Server is running' });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
