const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: null },
    availableQuantity: { type: Number, default: null },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
