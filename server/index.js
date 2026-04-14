const os = require('os');
const axios = require("axios");
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
app.use(cors())

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

async function getInstanceId() {
  try {
    // Step 1: get token
    const token = await axios.put(
      "http://169.254.169.254/latest/api/token",
      null,
      {
        headers: {
          "X-aws-ec2-metadata-token-ttl-seconds": "21600"
        }
      }
    );

    // Step 2: use token
    const response = await axios.get(
      "http://169.254.169.254/latest/meta-data/instance-id",
      {
        headers: {
          "X-aws-ec2-metadata-token": token.data
        }
      }
    );

    return response.data;
  } catch (err) {
    console.log("Metadata error:", err.message);
    return "metadata-not-available";
  }
}
app.get('/api/health', async (req, res) => {
  const instanceId = await getInstanceId();

  res.json({ message: 'Server is running', instanceId, containerId: os.hostname() });
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