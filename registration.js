const handleRegister = async () => {
    const response = await fetch('https://grantdatabase-backend.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Ensure email and password are defined
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data); // Log the response
    } else {
        console.error('Registration failed:', response.statusText); // Log any errors
    }
}; 