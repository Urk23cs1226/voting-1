const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

const app = express();

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- Middlewares ---
app.use(cors()); // Allows requests from other origins (like your frontend)
app.use(express.json()); // Allows server to accept JSON data in body

// --- API Routes ---
app.use('/api/auth', authRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
