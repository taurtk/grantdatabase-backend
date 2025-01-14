const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessName: { type: String },
    businessType: { type: String }, // e.g., non-profit, for-profit, startup
    size: { type: String }, // e.g., number of employees, revenue range
    sector: { type: String }, // e.g., technology, healthcare, education
    location: { type: String }, // e.g., country, province, city
    grantObjectives: { type: String }, // e.g., funding purpose
    eligibilityDetails: { type: String }, // e.g., years in operation
    specialCriteria: { type: String }, // e.g., minority ownership
    hasPaid: { type: Boolean, default: false } // To track payment status
});

module.exports = mongoose.model('User', userSchema); 