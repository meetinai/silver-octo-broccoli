// config.js
require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET,
    database: process.env.DATABASE_URL,
    port: process.env.PORT || 3000
};
