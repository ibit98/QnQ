import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import Reviews from "../../../models/reviews";

// Get Paginated leaderboard
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const limit = 25;
  const offset = Math.max(parseInt((req.query.offset ?? 0).toString()), 0);

  try {
    const data = await Reviews.aggregate()
      .group({
        _id: "$_creator",
        reputationScore: { $sum: "$meta.QoI" },
      })
      .lookup({
        from: "Users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      })
      .project({
        _id: true,
        reputationScore: true,
        user: { $arrayElemAt: ["$user", 0] },
      })
      .skip(offset)
      .limit(limit);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
