const chalk = require("chalk");
const express = require("express");
const router = express.Router();

const calculate_QoI = require("../../../helpers/qoi");
const Ratings = require("../../../models/ratings");
const Reviews = require("../../../models/reviews");

const currentRoute = "/api/reviews";

// Get Paginated Details of all Reviews
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

  Reviews.find({})
    .skip(resPerPage * (page - 1))
    .limit(resPerPage)
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

// Get Details of a single Review
router.get("/:id", (req, res, next) => {
  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + "/" + req.params.id)
  );

  // this will return all the data
  Reviews.findById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

// Post a new review
router.post("/", (req, res, next) => {
  console.log(
    chalk.inverse.green("POST") + " : " + chalk.italic.cyan("/api/reviews")
  );

  if (req.body.title) {
    Reviews.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "Review Title is missing",
    });
  }
});

// Post a rating for a review
router.post("/:reviewId/rate", (req, res, next) => {
  if (!req.body.userId || !req.body.feedback) {
    res.json({
      error: "User ID and/or Feedback is missing",
    });
    throw Error("Inserting Rating: User ID and/or Feedback is missing!");
  }

  if (
    req.body.feedback !== "helpful" &&
    req.body.feedback !== "harmful" &&
    req.body.feedback !== "uncertain"
  ) {
    throw Error("Invalid Rating. Must be from (helpful, harmful, uncertain)");
  }

  const feedback = req.body.feedback;
  const reviewId = req.params.reviewId;
  const userId = req.body.userId;

  console.log(
    chalk.inverse.green("POST") +
      "  : " +
      chalk.italic.cyan(currentRoute + "/" + reviewId + "/rate") +
      " " +
      chalk.gray(`{userId=${userId}, feedback=${feedback}}`)
  );

  Ratings.findOneAndUpdate(
    { _rater: userId, _review: reviewId },
    { feedback: feedback },
    { upsert: true }
  )
    .then((oldRatingData) => {
      Reviews.findOne({ _id: reviewId }, (err, reviewData) => {
        if (err || !reviewData) {
          throw Error(
            `Corresponding Review to Rating (_id=${oldRatingData._id}) does not exist`
          );
        }
        return reviewData;
      }).then((oldReviewData) => {
        let reviewUpdate = {
          meta: {
            beliefCount: oldReviewData.meta.beliefCount,
            disbeliefCount: oldReviewData.meta.disbeliefCount,
            uncertaintyCount: oldReviewData.meta.uncertaintyCount,
          },
        };

        if (oldRatingData) {
          switch (oldRatingData.feedback) {
            case "helpful":
              reviewUpdate.meta.beliefCount -= 1;
              break;
            case "harmful":
              reviewUpdate.meta.disbeliefCount -= 1;
              break;
            case "uncertain":
              reviewUpdate.meta.uncertaintyCount -= 1;
              break;
          }
        }

        switch (feedback) {
          case "helpful":
            reviewUpdate.meta.beliefCount += 1;
            break;
          case "harmful":
            reviewUpdate.meta.disbeliefCount += 1;
            break;
          case "uncertain":
            reviewUpdate.meta.uncertaintyCount =
              reviewUpdate.meta.uncertaintyCount + 1;
            break;
        }

        reviewUpdate.meta.QoI = calculate_QoI(reviewUpdate.meta);

        responseData = { oldRating: oldRatingData };

        Reviews.findByIdAndUpdate(reviewId, reviewUpdate).then((data) => {
          responseData.oldReview = data;
        });

        return res.json(responseData);
      });
    })
    .catch(next);
});

module.exports = router;
