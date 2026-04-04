const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_SECRET_KEY = "Adil_Agri_Secure_786"; 

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
  grade: { type: String, default: "Pending Verification" },
  storedDate: { type: Date, default: Date.now }
}));

// SECURITY MIDDLEWARE
const verifyKey = (req, res, next) => {
  if (req.headers['x-api-key'] === ADMIN_SECRET_KEY) next();
  else res.status(403).json({ error: "Access Denied" });
};

// 1. GET ALL DATA (Public view for Dashboard)
app.get('/api/inventory', async (req, res) => {
  try {
    const data = await Batch.find().sort({ storedDate: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. ADMIN POST (Secure - For verified entries)
app.post('/api/inventory', verifyKey, async (req, res) => {
  try {
    const newBatch = new Batch({ ...req.body, grade: "A (Verified)" });
    await newBatch.save();
    res.status(201).json({ message: "Verified Entry Saved!" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 3. FARMER POST (Public - For new listings)
app.post('/api/public/list-crop', async (req, res) => {
  try {
    const farmerEntry = new Batch({
      ...req.body,
      batchId: "REQ-" + Math.floor(1000 + Math.random() * 9000),
      grade: "Pending Verification"
    });
    await farmerEntry.save();
    res.status(201).json({ message: "Request Sent!" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
