require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');
const redirectRoutes = require('./routes/redirect');

const app = express();

// =====================
// CORS
// =====================
app.use(cors({
  origin: [
    "http://16.171.240.13:3000",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// IMPORTANT: remove app.options("*") completely

// =====================
// Body parser
// =====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// Logger (MUST BE EARLY)
// =====================
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// =====================
// MongoDB
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// =====================
// Routes
// =====================
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/', redirectRoutes);

// =====================
// Health check
// =====================
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// =====================
// 404 handler
// =====================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// =====================
// Start server
// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});