const express = require('express');
const { registerUser, loginUser, createPaymentIntent } = require('../controllers/userController');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ error: 'This email is already registered. Please use a different email.' });
        }
        res.status(500).json({ error: 'An error occurred while registering. Please try again later.' });
    }
});

router.post('/login', loginUser);
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router; 