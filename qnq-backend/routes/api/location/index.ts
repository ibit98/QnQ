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
        avgScore: { $avg: "$score" },
        minQoI: { $min: "$meta.QoI" },
        maxQoI: { $max: "$meta.QoI" },
        avgQoI_x_score: { $avg: { $multiply: ["$score", "$meta.QoI"] } },
      });

    if (data.length < 1 || data[0].count < 2) {
      return res.json(0);
    }

    const { avgScore, minQoI, maxQoI, avgQoI_x_score } = data[0];

    const normalisedScore =
      maxQoI === minQoI
        ? 0
        : (avgQoI_x_score - minQoI * avgScore) / (maxQoI - minQoI);

    res.json(normalisedScore);
  } catch (e) {
    next(e);
  }
});

export default router;
