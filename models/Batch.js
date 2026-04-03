const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    batchId: { type: String, required: true }, // e.g., B001
    crop: { type: String, required: true },
    farmerName: { type: String, required: true },
    quantity: { type: Number, required: true },
    grade: { type: String, enum: ['A', 'B', 'C'] }, //
    storedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Batch', BatchSchema);
