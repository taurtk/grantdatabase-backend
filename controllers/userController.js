const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Register User
exports.registerUser = async (req, res) => {
    console.log('RegisterUser function called'); // Log to confirm function is called
    const { email, password, profile } = req.body;

    console.log('Registering user:', email); // Debugging log
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, profile });

    try {
        await user.save();
        console.log('User saved successfully:', user); // Debugging log

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated Token:', token); // Debugging log

        // Send the token in the response
        res.status(201).json({ message: 'User registered successfully ghjkl', token });
    } catch (error) {
        console.error('Error during registration:', error); // Log the error
        res.status(400).json({ error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
    const { amount, currency, description, payment_method, shipping } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            description,
            payment_method,
            shipping,
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
};