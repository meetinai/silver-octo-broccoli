const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to database
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurant'));
app.use('/api/foodItems', require('./routes/foodItem'));

// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
