const chalk = require("chalk");
const express = require("express");
const router = express.Router();

const Reviews = require("../../../models/reviews");

const currentRoute = "/api/leaderboard";

// Get Paginated Details of all Users
router.get("/", (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + "?page=" + page)
  );

  if (page < 1) {
    throw Error("Non-positive Page Number");
  }

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
    .project("-user.salt -user.hash")
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

module.exports = router;
