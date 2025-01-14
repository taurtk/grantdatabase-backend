const stripe = require('stripe');

// Ensure you have your API key set correctly
const apiKey = process.env.STRIPE_SECRET_KEY; // Use the correct environment variable for the secret key

if (!apiKey) {
    throw new Error('Stripe API key is not set. Please set the STRIPE_SECRET_KEY environment variable.');
}

const stripeInstance = stripe(apiKey); // Pass the API key to the Stripe instance 