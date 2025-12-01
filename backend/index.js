require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
let ratelimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const educatorRoutes = require('./routes/educatorRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
let limit = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limit);
app.set("trust proxy",1);
// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // parse JSON body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount educator routes at /api/educator
app.use('/api/educator', educatorRoutes);
app.use('/api/student', require('./routes/studentRoutes'));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler (minimal)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});