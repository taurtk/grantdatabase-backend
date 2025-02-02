const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

    if (!token) {
        console.log('No token provided'); // Debugging log
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err); // Debugging log
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded; // Assuming the decoded token contains user info
        next();
    });
};

module.exports = authMiddleware; 