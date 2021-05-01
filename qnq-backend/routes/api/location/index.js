const express = require("express");
const router = express.Router();

const Reviews = require("../../../models/reviews");

// Get Location score based on all reviews
router.get("/:placeID/score", async (req, res, next) => {
  const placeID = req.params.placeID;

  try {
    const data = await Reviews.aggregate()
      .match({ _location: placeID })
      .group({
        _id: "$_location",
        count: { $sum: 1 },
        minScore: { $min: "$score" },
        maxScore: { $max: "$score" },
        avgScore: { $avg: "$score" },
      });

    res.json(data[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
