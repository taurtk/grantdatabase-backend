const handleLogin = async () => {
    // After successful login
    const response = await fetch('https://grantdatabase-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token
        console.log('Token stored:', data.token); // Debugging log
    } else {
        // Handle login error
    }
}; 