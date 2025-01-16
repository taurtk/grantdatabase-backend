const Grant = require('../models/Grant');

// Constant weights for different matching criteria
const WEIGHTS = {
    FUNDING_AMOUNT: 40,
    OBJECTIVES_MATCH: 35,
    ELIGIBILITY_MATCH: 25
};

// Helper function to calculate funding amount range match
const getFundingAmountScore = (grantAmount, requestedRange) => {
    const ranges = {
        '0-50k': [0, 50000],
        '50k-100k': [50000, 100000],
        '100k-500k': [100000, 500000],
        '500k+': [500000, Infinity]
    };
    
    const [min, max] = ranges[requestedRange] || [0, 0];
    if (grantAmount >= min && grantAmount <= max) return 1;
    
    // Partial score if the amount is close to the range
    if (grantAmount < min && grantAmount >= min * 0.8) return 0.5;
    if (grantAmount > max && grantAmount <= max * 1.2) return 0.5;
    
    return 0;
};

// Helper function to calculate keyword match score
const getKeywordMatchScore = (text, keywords) => {
    if (!text || !keywords.length) return 0;
    
    const textLower = text.toLowerCase();
    const matchingKeywords = keywords.filter(keyword => 
        textLower.includes(keyword.toLowerCase())
    );
    
    return matchingKeywords.length / keywords.length;
};

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

// Main matching algorithm
exports.matchGrants = async (req, res) => {
    try {
        const profile = req.body;
        const allGrants = await Grant.find({
            deadline: { $gte: new Date() } // Only get grants with future deadlines
        });
        
        // Extract keywords from profile for matching
        const keywordsToMatch = [
            profile.fundingPurpose,
            profile.sector,
            profile.type,
            ...profile.specialCriteria
        ].filter(Boolean); // Remove any undefined/null values

        // Calculate match scores for each grant
        const matchedGrants = allGrants.map(grant => {
            let score = 0;
            let matchDetails = {};

            // Funding amount match (40% weight)
            const amountScore = getFundingAmountScore(grant.fundingAmount, profile.fundingAmount);
            score += amountScore * WEIGHTS.FUNDING_AMOUNT;
            matchDetails.fundingAmount = amountScore;

            // Objectives match (35% weight)
            const objectivesScore = getKeywordMatchScore(grant.objectives, keywordsToMatch);
            score += objectivesScore * WEIGHTS.OBJECTIVES_MATCH;
            matchDetails.objectives = objectivesScore;

            // Eligibility match (25% weight)
            const eligibilityKeywords = [
                profile.type,
                profile.size,
                profile.sector,
                ...profile.specialCriteria
            ].filter(Boolean);
            
            const eligibilityScore = getKeywordMatchScore(grant.eligibility, eligibilityKeywords);
            score += eligibilityScore * WEIGHTS.ELIGIBILITY_MATCH;
            matchDetails.eligibility = eligibilityScore;

            // Calculate final percentage
            const matchPercentage = Math.round((score / 100) * 100);

            return {
                grant: {
                    ...grant.toObject(),
                    matchPercentage,
                    matchDetails,
                    deadline: grant.deadline,
                    daysUntilDeadline: Math.ceil((grant.deadline - new Date()) / (1000 * 60 * 60 * 24))
                }
            };
        });

        // Filter and sort matches
        const validMatches = matchedGrants
            .filter(match => match.grant.matchPercentage >= 40) // Minimum match threshold
            .sort((a, b) => {
                // Primary sort by match percentage
                if (b.grant.matchPercentage !== a.grant.matchPercentage) {
                    return b.grant.matchPercentage - a.grant.matchPercentage;
                }
                // Secondary sort by deadline (closer deadlines first)
                return a.grant.deadline - b.grant.deadline;
            });

        // Return top matches with detailed scoring
        res.status(200).json({
            matches: validMatches.slice(0, 10), // Return top 10 matches
            totalMatches: validMatches.length,
            matchCriteria: {
                weights: WEIGHTS,
                minimumThreshold: 40
            }
        });

    } catch (error) {
        console.error('Error in grant matching:', error);
        res.status(500).json({ error: 'Failed to match grants' });
    }
};

// Add dynamic update functionality
exports.updateGrant = async (req, res) => {
    try {
        const { grantId } = req.params;
        const updates = req.body;
        
        const grant = await Grant.findByIdAndUpdate(
            grantId,
            updates,
            { new: true, runValidators: true }
        );
        
        if (!grant) {
            return res.status(404).json({ error: 'Grant not found' });
        }
        
        res.status(200).json(grant);
    } catch (error) {
        console.error('Error updating grant:', error);
        res.status(500).json({ error: 'Failed to update grant' });
    }
}; 