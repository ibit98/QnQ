const chalk = require("chalk");
const express = require("express");
const router = express.Router();

const Auth = require("../../auth");
const calculate_QoI = require("../../../helpers/qoi");
const Ratings = require("../../../models/ratings");
const Reviews = require("../../../models/reviews");

const currentRoute = "/api/reviews";

// TODO: Change all pagination to offset + limit instead of limit and page.

// Get Paginated Details of all Reviews
router.get("/", (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  if (page < 1) {
    console.log("Non-positive Page Number. Changing to page 1.");
    page = 1;
  }

  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + "?page=" + page)
  );

  Reviews.find({})
    .skip(resPerPage * (page - 1))
    .limit(resPerPage)
    .populate("_creator", "_id name")
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

// Get Paginated Details of all Reviews of a location
router.get("/location/:placeId", (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;
  const placeId = req.params.placeId;

  if (page < 1) {
    console.log("Non-positive Page Number. Changing to page 1.");
    page = 1;
  }

  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + `/location/${placeId}?page=${page}`)
  );

  Reviews.find({ _location: placeId })
    .skip(resPerPage * (page - 1))
    .limit(resPerPage)
    .populate("_creator", "_id name")
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

// Get Count of all Reviews written by currently logged in user
router.get("/me/count", Auth.required, (req, res, next) => {
  const placeId = req.params.placeId;

  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + "/me/count")
  );

  const {
    payload: { id },
  } = req;

  Reviews.countDocuments({ _creator: id })
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

// Get if the current user has rated a review
router.get("/:id/my-rating", Auth.required, (req, res, next) => {
  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + `/${req.params.id}/my-rating`)
  );

  const {
    payload: { id },
  } = req;

  // this will return the rating entry if it exists
  Ratings.findOne({ _review: req.params.id, _rater: id })
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

// Post a new review/ Update an old review
router.post("/location/:placeId", Auth.required, (req, res, next) => {
  const placeId = req.params.placeId;
  console.log(
    chalk.inverse.green("POST") +
      " : " +
      chalk.italic.cyan(`${currentRoute}/location/${placeId}`)
  );

  const { title, text, creator, score } = req.body;

  // TODO: clear all ratings with this review ID, and also change meta to (0, 0, 0).

  if (title) {
    Reviews.findOneAndUpdate(
      { _creator: creator, _location: placeId },
      { title: title, text: text, score: score },
      { new: true, upsert: true }
    )
      .populate("_creator", "_id name")
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "Some field is missing",
    });
  }
});

// Post a rating for a review
router.post("/:reviewId/rate", Auth.required, (req, res, next) => {
  if (!req.body.userId || !req.body.feedback) {
    res.json({
      error: "User ID and/or Feedback is missing",
    });
    throw Error("Inserting Rating: User ID and/or Feedback is missing!");
  }

  if (
    req.body.feedback !== "helpful" &&
    req.body.feedback !== "harmful" &&
    req.body.feedback !== "uncertain" &&
    req.body.feedback !== "none"
  ) {
    throw Error(
      "Invalid Rating. Must be from (helpful, harmful, uncertain, none)"
    );
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

  if (feedback == "none") {
    Ratings.findOneAndDelete({ _rater: userId, _review: reviewId })
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

          reviewUpdate.meta.QoI = calculate_QoI(reviewUpdate.meta);

          responseData = { oldRating: oldRatingData };

          Reviews.findByIdAndUpdate(reviewId, reviewUpdate).then((data) => {
            responseData.oldReview = data;
            responseData.updatedMeta = reviewUpdate.meta;
            return res.json(responseData);
          });
        });
      })
      .catch(next);
  } else {
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
              reviewUpdate.meta.uncertaintyCount += 1;
              break;
          }

          reviewUpdate.meta.QoI = calculate_QoI(reviewUpdate.meta);

          responseData = { oldRating: oldRatingData };

          Reviews.findByIdAndUpdate(reviewId, reviewUpdate).then((data) => {
            responseData.oldReview = data;
            responseData.updatedMeta = reviewUpdate.meta;
            return res.json(responseData);
          });
        });
      })
      .catch(next);
  }
});

module.exports = router;
