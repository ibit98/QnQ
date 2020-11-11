const express = require('express');
const router = express.Router();

const userRoutes = require('./api-routes/users');
const reviewRoutes = require('./api-routes/reviews');
const leaderboardRoutes = require('./api-routes/leaderboard');

router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;
