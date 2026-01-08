const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Route files
const auth = require('./routes/authRoutes');
const projects = require('./routes/projectRoutes');
const reports = require('./routes/reportRoutes');
const tasks = require('./routes/taskRoutes');
const teams = require('./routes/teamMemberRoutes');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/reports', reports);
app.use('/api/tasks', tasks);
app.use('/api/team-members', teams);

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;