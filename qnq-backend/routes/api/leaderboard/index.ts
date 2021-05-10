import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
const router = express.Router();

import Auth from "../../auth";
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
      .project({
        _id: true,
        reputationScore: true,
        name: "$user.name",
        email: "$user.email",
      })
      .sort("-reputationScore")
      .skip(offset)
      .limit(limit);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// Get my rank
router.get(
  "/my",
  Auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.user["id"].toString();

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
        .project({
          _id: true,
          reputationScore: true,
          name: "$user.name",
          email: "$user.email",
        })
        .sort("-reputationScore")
        .group({
          _id: false,
          users: {
            $push: {
              _id: "$_id",
              name: "$name",
              reputationScore: "$reputationScore",
              email: "$email",
            },
          },
        })
        .unwind({
          path: "$users",
          includeArrayIndex: "rank",
        })
        .match({
          "users._id": mongoose.Types.ObjectId(id),
        });

      res.json(data[0].rank + 1);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
