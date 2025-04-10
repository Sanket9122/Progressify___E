require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running in ${config.environment} mode on port ${config.port}`);
});
