const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

router.get('/:restaurantId', async (req, res) => {
    try {
        const foodItems = await FoodItem.find({ restaurant: req.params.restaurantId });
        res.send(foodItems.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl,
            availableQuantity: item.availableQuantity,
            restaurant: item.restaurant
        })));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/:restaurantId', authMiddleware, async (req, res) => {
    const { name, price, description, imageUrl, availableQuantity } = req.body;
    const restaurantId = req.params.restaurantId;

    if (req.user.type !== 'restaurant') {
        return res.status(403).send({ message: 'Access denied' });
    }

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Access denied' });
        }

        const foodItem = new FoodItem({ name, price, description, imageUrl, availableQuantity, restaurant: restaurantId });
        await foodItem.save();
        res.status(201).send({
            message: 'Food item added successfully',
            foodItem: {
                id: foodItem._id,
                name: foodItem.name,
                price: foodItem.price,
                description: foodItem.description,
                imageUrl: foodItem.imageUrl,
                availableQuantity: foodItem.availableQuantity,
                restaurant: foodItem.restaurant
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
