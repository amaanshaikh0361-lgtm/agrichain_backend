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

// Schema (batchId mein hum emoji save kar rahe hain)
const Batch = mongoose.model('Batch', new mongoose.Schema({
  batchId: { type: String, default: "📦" }, 
  crop: String,
  farmerName: String,
  quantity: Number,
  grade: { type: String, default: "Pending Verification" },
  storedDate: { type: Date, default: Date.now }
}));

// Security Middleware
const verifyKey = (req, res, next) => {
  if (req.headers['x-api-key'] === ADMIN_SECRET_KEY) next();
  else res.status(403).json({ error: "Access Denied" });
};

// --- ROUTES ---

// 1. Get All Data
app.get('/api/inventory', async (req, res) => {
  try {
    const data = await Batch.find().sort({ storedDate: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Farmer Public Post (Listing Request)
app.post('/api/public/list-crop', async (req, res) => {
  try {
    const newEntry = new Batch(req.body);
    await newEntry.save();
    res.status(201).json({ message: "Request Sent!" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 3. Admin Verify/Accept (Secure)
app.put('/api/inventory/verify/:id', verifyKey, async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(
      req.params.id, 
      { grade: "A (Verified)" }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 4. Admin Delete (Secure)
app.delete('/api/inventory/:id', verifyKey, async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
