const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'name email');
        res.send(restaurants);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { name, description, address } = req.body;
    if (req.user.type !== 'restaurant') {
        return res.status(403).send({ message: 'Access denied' });
    }

    if (!name || !description || !address) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    try {
        const restaurant = new Restaurant({ name, description, address, owner: req.user._id });
        await restaurant.save();
        res.status(201).send(restaurant);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
