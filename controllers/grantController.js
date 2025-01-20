const Grant = require('../models/Grant'); // Grant model

// Define weights for the matching algorithm
const WEIGHTS = {
    NAME_MATCH: 40,    // 40% weight for name matching
    FUNDING_MATCH: 60  // 60% weight for funding amount matching
};

// Helper function to calculate name match score
const calculateNameMatchScore = (grantName, searchName) => {
    if (!searchName) return 0;
    
    const grantNameLower = grantName.toLowerCase();
    const searchNameLower = searchName.toLowerCase();
    
    // Check if the grant name contains the search term
    return grantNameLower.includes(searchNameLower) ? 1 : 0;
};

// Helper function to calculate funding amount match score
const calculateFundingMatchScore = (grantAmount, desiredAmount) => {
    if (!desiredAmount) return 0;
    
    // Convert desired amount to number if it's a string
    const targetAmount = Number(desiredAmount);
    
    // Calculate the difference percentage
    const difference = Math.abs(grantAmount - targetAmount);
    const percentageDiff = difference / targetAmount;
    
    // Return a score based on how close the amounts are
    if (percentageDiff <= 0.1) return 1;      // Within 10%
    if (percentageDiff <= 0.2) return 0.8;    // Within 20%
    if (percentageDiff <= 0.3) return 0.6;    // Within 30%
    if (percentageDiff <= 0.4) return 0.4;    // Within 40%
    if (percentageDiff <= 0.5) return 0.2;    // Within 50%
    return 0;                                 // More than 50% difference
};

// Main matching algorithm
exports.matchGrants = async (req, res) => {
    try {
        const { name, fundingAmount } = req.body;
        console.log('Search criteria:', { name, fundingAmount });

        // Validate input
        if (!name && !fundingAmount) {
            return res.status(400).json({
                error: 'Please provide at least one search criterion (name or fundingAmount)'
            });
        }

        // Build match conditions
        const matchConditions = [];

        // Add name condition if provided
        if (name) {
            matchConditions.push({
                name: {
                    $regex: name,
                    $options: 'i'
                }
            });
        }

        // Add funding amount condition if provided
        if (fundingAmount && fundingAmount.$gte && fundingAmount.$lte) {
            matchConditions.push({
                fundingAmount: {
                    $gte: Number(fundingAmount.$gte),
                    $lte: Number(fundingAmount.$lte)
                }
            });
        }

        // Build the pipeline
        const pipeline = [
            {
                $match: matchConditions.length > 1 
                    ? { $and: matchConditions }
                    : matchConditions[0] // If only one condition, no need for $and
            }
        ];

        console.log('MongoDB pipeline:', JSON.stringify(pipeline, null, 2));

        // Execute the aggregation pipeline
        const matchingGrants = await Grant.aggregate(pipeline);
        console.log('Found grants:', matchingGrants.length);

        if (!matchingGrants?.length) {
            return res.status(200).json({
                matches: [],
                totalMatches: 0,
                matchCriteria: {
                    pipeline,
                    minimumThreshold: 40
                }
            });
        }

        // Calculate match scores for each grant
        const matchedGrants = matchingGrants.map(grant => {
            // Calculate name match score
            const nameScore = name ? calculateNameMatchScore(grant.name, name) : 1;
            
            // Calculate funding match score
            let fundingScore = 1;
            if (fundingAmount && fundingAmount.$gte && fundingAmount.$lte) {
                const avgRequestedAmount = (Number(fundingAmount.$gte) + Number(fundingAmount.$lte)) / 2;
                fundingScore = calculateFundingMatchScore(grant.fundingAmount, avgRequestedAmount);
            }

            const totalScore = (nameScore * WEIGHTS.NAME_MATCH) + 
                             (fundingScore * WEIGHTS.FUNDING_MATCH);

            return {
                grant: {
                    ...grant,
                    matchPercentage: Math.round(totalScore),
                    matchDetails: {
                        nameMatch: nameScore,
                        fundingMatch: fundingScore,
                        fundingAmount: grant.fundingAmount
                    }
                }
            };
        });

        // Sort by match percentage
        const validMatches = matchedGrants
            .filter(match => match.grant.matchPercentage >= 40)
            .sort((a, b) => b.grant.matchPercentage - a.grant.matchPercentage);

        res.status(200).json({
            matches: validMatches.slice(0, 10),
            totalMatches: validMatches.length,
            matchCriteria: {
                pipeline,
                weights: WEIGHTS,
                minimumThreshold: 40
            }
        });
    } catch (error) {
        console.error('Error in grant matching:', error);
        res.status(500).json({ error: 'Failed to match grants' });
    }
};

// Export other functions if needed
exports.createGrant = async (req, res) => {
    // Logic for creating a grant...
};

exports.getAllGrants = async (req, res) => {
    // Logic for getting all grants...
};

// Ensure all functions are exported