const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    sector: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    objectives: {
        fundingPurpose: {
            type: String,
            required: true,
        },
        desiredFundingAmount: {
            type: String,
            required: true,
        },
    },
    eligibility: {
        yearsInOperation: {
            type: Number,
            required: true,
        },
        registrationStatus: {
            type: String,
            required: true,
        },
    },
    specialCriteria: {
        type: [String], // Array of strings for special criteria
        default: [],
    },
});

// User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: userProfileSchema, // Embed the user profile schema
});

const User = mongoose.model('User', userSchema);
module.exports = User; 