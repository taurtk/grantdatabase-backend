const mongoose = require('mongoose');

const grantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fundingAmount: { type: Number, required: true },
    deadline: { type: Date, required: true },
    eligibility: { type: String, required: true },
    objectives: { type: String }, // e.g., funding purpose
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grant', grantSchema); 