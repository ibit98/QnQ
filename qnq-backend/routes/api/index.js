const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/reviews", require("./reviews"));
router.use("/leaderboard", require("./leaderboard"));

module.exports = router;
