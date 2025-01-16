const express = require('express');
const { registerUser, loginUser, createPaymentIntent } = require('../controllers/userController');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router; 