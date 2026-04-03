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
  grade: String,
  storedDate: { type: Date, default: Date.now }
}));

// Routes
app.get('/', (req, res) => res.send("Backend is Running, Bhai!"));

app.get('/api/inventory', async (req, res) => {
  try {
    const data = await Batch.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
