const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token'); // Retrieve the token

        const response = await fetch('https://grantdatabase-backend.onrender.com/api/grants/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(profile), // Send the user profile for matching
        });
        
        if (!response.ok) {
            throw new Error('Failed to match grants');
        }

        const matchingGrants = await response.json(); // Get the matching grants from the response
        console.log('Matching Grants:', matchingGrants); // For debugging

        // Handle the matching grants as needed
        setStep(step + 1); // Move to the next step
    } catch (error) {
        console.error('Error matching grants:', error);
    }
}; 