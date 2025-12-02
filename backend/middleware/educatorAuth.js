const jwt = require('jsonwebtoken');

const protectEducator = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: 'Not authorized, no token' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role !== 'educator') {
                return res.status(403).json({ message: 'Not authorized as an educator' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protectEducator;
