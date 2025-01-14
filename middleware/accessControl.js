const User = require('../models/User');

const accessControl = async (req, res, next) => {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const user = await User.findById(userId);
    
    if (!user || !user.hasPaid) {
        return res.status(403).json({ message: 'Access denied. Please complete payment to access this feature.' });
    }
    next();
};

module.exports = accessControl; 