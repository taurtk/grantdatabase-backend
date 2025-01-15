const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
        if (!stripe || !elements) {
            throw new Error('Stripe or Elements not loaded');
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            throw new Error('CardElement not found');
        }

        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                email: email,
            },
        });

        if (stripeError) {
            throw new Error(stripeError.message);
        }

        // Call the backend to create a payment intent
        const response = await fetch('https://grantdatabase-backend.onrender.com/api/users/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 12000,
                currency: 'CAD',
                description: 'Access to Grants Matching Tool',
                payment_method: paymentMethod.id,
                shipping: {
                    name: shippingDetails.name,
                    address: {
                        line1: shippingDetails.addressLine1,
                        postal_code: shippingDetails.postalCode,
                        city: shippingDetails.city,
                        state: shippingDetails.state,
                        country: shippingDetails.country,
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create payment intent');
        }

        const { clientSecret } = await response.json(); // Get the client secret from the response

        // Confirm the payment with the client secret
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

        if (confirmError) {
            throw new Error(confirmError.message);
        }

        // Payment succeeded, navigate to the dashboard
        navigate('/dashboard');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
        setLoading(false);
    }
}; 