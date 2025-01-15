const Grant = require('../models/Grant');

// Create Grant
exports.createGrant = async (req, res) => {
    const grant = new Grant(req.body);
    try {
        await grant.save();
        res.status(201).json(grant);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Grants
exports.getAllGrants = async (req, res) => {
    try {
        const grants = await Grant.find();
        res.json(grants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Match Grants
exports.matchGrants = async (req, res) => {
    const profile = req.body;

    try {
        // Logic to find matching grants based on the profile
        const matchingGrants = await Grant.find({
            // Example matching logic (customize as needed)
            fundingPurpose: profile.fundingPurpose,
            sector: profile.sector,
            // Add more matching criteria based on the profile
        });

        res.status(200).json(matchingGrants);
    } catch (error) {
        console.error('Error matching grants:', error);
        res.status(500).json({ error: 'Failed to match grants' });
    }
}; 