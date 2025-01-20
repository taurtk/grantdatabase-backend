const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');

        const response = await fetch('https://grantdatabase-backend.onrender.com/api/grants/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(profile),
        });
        
        if (!response.ok) {
            throw new Error('Failed to match grants');
        }

        const matchingGrants = await response.json();
        console.log('Matching Grants:', matchingGrants);
        setStep(step + 1);
    } catch (error) {
        console.error('Error matching grants:', error);
    }
}; 