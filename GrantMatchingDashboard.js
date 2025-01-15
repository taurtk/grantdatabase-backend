const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Retrieve the token from local storage or wherever you store it
        const token = localStorage.getItem('token'); // Adjust this based on your implementation

        const response = await fetch('https://grantdatabase-backend.onrender.com/api/grants/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(profile),
        });
        
        if (!response.ok) {
            throw new Error('Failed to match grants');
        }

        const matchingGrants = await response.json(); // Get the matching grants from the response
        console.log('Matching Grants:', matchingGrants); // For debugging

        // Here you can set the matching grants to state or handle them as needed
        // For example, you might want to store them in a state variable
        // setMatchingGrants(matchingGrants);
        
        setStep(step + 1); // Move to the next step
    } catch (error) {
        console.error('Error matching grants:', error);
    }
}; 