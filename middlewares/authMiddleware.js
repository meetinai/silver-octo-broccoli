const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
