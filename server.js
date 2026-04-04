const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("AgriChain DB Connected! 🚀"))
  .catch(err => console.error("DB Error:", err));

// Model
const Batch = mongoose.model('Batch', new mongoose.Schema({
  batchId: String,
  crop: String,
  farmerName: String,
  quantity: Number,
  grade: { type: String, default: "A" },
  storedDate: { type: Date, default: Date.now }
}));

// Routes
app.get('/', (req, res) => res.send("Backend is Running, Bhai!"));

// Get Data
app.get('/api/inventory', async (req, res) => {
  try {
    const data = await Batch.find().sort({ storedDate: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Data (Naya Farmer/Batch add karne ke liye)
app.post('/api/inventory', async (req, res) => {
  try {
    const newBatch = new Batch(req.body);
    await newBatch.save();
    res.status(201).json({ message: "Data Saved!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
