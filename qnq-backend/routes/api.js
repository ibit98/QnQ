const express = require('express');
const router = express.Router();

const userRoutes = require('./api-routes/users');
const reviewRoutes = require('./api-routes/reviews');

router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
