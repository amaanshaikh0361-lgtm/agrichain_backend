const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Netlify se request allow karne ke liye
app.use(express.json());

// MongoDB Connection logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("AgriChain DB Connected! 🚀"))
  .catch(err => console.error("DB Connection Error:", err));

// Sample API Route for Inventory
const Batch = require('./models/Batch');
app.get('/api/inventory', async (req, res) => {
    try {
        const inventory = await Batch.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
