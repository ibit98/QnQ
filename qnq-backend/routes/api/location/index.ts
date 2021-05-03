import express from "express";

import Reviews from "../../../models/reviews";

const router = express.Router();

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
        sumQoI: { $sum: "$meta.QoI" },
      });

    res.json(data[0]);
  } catch (e) {
    next(e);
  }
});

export default router;
