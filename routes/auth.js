const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, mobileNumber, email, password, type } = req.body;
    if (!name || !email || !password || !type) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, mobileNumber, email, password: hashedPassword, type });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, type: user.type }, config.secret, { expiresIn: '24h' });
        res.send({ message: 'User logged in successfully', token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
