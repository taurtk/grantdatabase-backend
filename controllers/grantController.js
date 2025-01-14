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
    const { criteria } = req.body; // Criteria from user input
    console.log('Matching Criteria:', criteria);
    try {
        const grants = await Grant.find();
        console.log('All Grants:', grants); // Log all grants
        const matchedGrants = grants.filter(grant => {
            const eligibilityMatch = grant.eligibility.toLowerCase().includes(criteria.eligibility.toLowerCase());
            const keywordMatch = grant.name.toLowerCase().includes(criteria.keywords.toLowerCase());
            console.log(`Grant: ${grant.name}, Eligibility Match: ${eligibilityMatch}, Keyword Match: ${keywordMatch}`);
            return eligibilityMatch && keywordMatch;
        });
        res.json(matchedGrants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 