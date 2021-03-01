const chalk = require("chalk");
const express = require("express");
const router = express.Router();

const Reviews = require("../../../models/reviews");

const currentRoute = "/api/leaderboard";

// Get Paginated Details of all Users
router.get("/", (req, res, next) => {
  const defaultLimit = 50;
  const defaultOffset = 0;

  const limit = parseInt((req.query.limit || defaultLimit).toString(), 10);
  const offset = parseInt((req.query.offset || defaultOffset).toString(), 10);

  Reviews.aggregate()
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
      gender: "$user.gender",
      name: "$user.name",
      email: "$user.email",
    })
    .project("-user.salt -user.hash")
    .sort("-reputationScore name")
    .skip(offset)
    .limit(limit)
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

module.exports = router;
