import express, { Request, Response, NextFunction } from "express";

import Auth from "../../auth";
import calculateQoI from "../../../helpers/qoi";
import Ratings, { RatingDocument } from "../../../models/ratings";
import Reviews, {
  getReviewById,
  deleteReviewByPK,
} from "../../../models/reviews";

const router = express.Router();

// To get corresponding meta string from feedback
const getCountString = (feedback: "harmful" | "helpful" | "uncertain") => {
  switch (feedback) {
    case "harmful":
      return "disbeliefCount";
    case "helpful":
      return "beliefCount";
    case "uncertain":
      return "uncertaintyCount";
  }
};

// Get / - Paginated Details of all Reviews
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const limit = 25;
  const offset = Math.max(parseInt((req.query.offset ?? 0).toString()), 0);

  try {
    const data = await Reviews.find({})
      .skip(offset)
      .limit(limit)
      .populate("_creator", "_id name");

    res.json(data);
  } catch (e) {
    next(e);
  }
});

// Get /location/:placeId - Paginated Details of all Reviews of a location
router.get(
  "/location/:placeId",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = 25;
    const offset = Math.max(parseInt((req.query.offset ?? 0).toString()), 0);
    const placeId = req.params.placeId.toString();

    try {
      const data = await Reviews.find({ _location: placeId })
        .skip(offset)
        .limit(limit)
        .populate("_creator", "_id name");
      res.json(data);
    } catch (error) {
      // If the error is caused due to invalid Review ID being requested,
      // return Response Status 404: Not found
      if (error.name === "CastError") {
        return res.status(404).json(`Location with id ${placeId} not found!`);
      }

      next(error);
    }
  }
);

// Get /me/count - Count of all Reviews written by currently logged in user
router.get(
  "/me/count",
  Auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.user["id"];

    try {
      const data = await Reviews.countDocuments({ _creator: id });
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);

// Get /:id - Details of a single Review
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id.toString();

  try {
    const review = await getReviewById(id);

    // If the review is null, no such review exists
    // return Response Status 404: Not found
    if (review === null) {
      return res.status(404).json(`Review with id ${id} not found!`);
    }

    return res.json(review);
  } catch (error) {
    next(error);
  }
});

// Get if the current user has rated a review
router.get(
  "/:id/my-rating",
  Auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id.toString();
    const raterId: string = req.user["id"];

    try {
      const rating = await Ratings.findOne({
        _review: reviewId,
        _rater: raterId,
      });
      res.json(rating);
    } catch (error) {
      // If the error is caused due to invalid Review ID being requested,
      // return Response Status 404: Not found
      if (error.name === "CastError") {
        return res.status(404).json(`Review with id ${reviewId} not found!`);
      }

      next(error);
    }
  }
);

// Post /location/:placeId - create a new review/ Update an old review
router.post(
  "/location/:placeId",
  Auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const placeId = req.params.placeId;
    const { title, text, score } = req.body;
    const creatorId: string = req.user["id"];

    await deleteReviewByPK(creatorId, placeId);

    // If any of the required body parameters (title) are
    // missing then send Status 422: Unprocessable Entity
    if (!title) {
      return res.status(422).json("required query parameter 'title' missing");
    }

    try {
      const createdReview = await Reviews.findOneAndUpdate(
        { _creator: creatorId, _location: placeId },
        { title: title, text: text, score: score },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).populate("_creator", "_id name");

      return res.status(201).json(createdReview);
    } catch (error) {
      // If the error is caused due to invalid Review ID being requested,
      // return Response Status 404: Not found
      if (error.name === "CastError") {
        return res.status(404).json(`Location with id ${placeId} not found!`);
      }

      next(error);
    }
  }
);

// Post a rating for a review
router.post(
  "/:reviewId/rate",
  Auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.reviewId.toString();
    const { feedback }: { feedback: string } = req.body;
    const raterId: string = req.user["id"];

    // If any of the required body parameters (feedback) are
    // missing then send Status 422: Unprocessable Entity
    if (!feedback) {
      return res.status(422).json("required body parameter 'feedback' missing");
    }

    switch (feedback) {
      case "helpful":
      case "harmful":
      case "uncertain":
      case "none":
        break;
      default:
        return res
          .status(422)
          .json(
            "Invalid Rating. Must be from (helpful, harmful, uncertain, none)."
          );
    }

    const oldReview = await getReviewById(reviewId);

    if (oldReview === null) {
      return res.status(404).json(`Review with id ${reviewId} not found!`);
    }

    try {
      let oldRating: RatingDocument;

      if (feedback == "none") {
        // Delete rating
        oldRating = await Ratings.findOneAndDelete({
          _rater: raterId,
          _review: reviewId,
        });

        // Decrement old rating count, if needed
        if (oldRating !== null) {
          // previous rating existed
          oldReview.meta[getCountString(oldRating.feedback)] -= 1;
        }
      } else {
        // Update rating
        const oldRating = await Ratings.findOneAndUpdate(
          { _rater: raterId, _review: reviewId },
          { feedback: feedback },
          { upsert: true, setDefaultsOnInsert: true }
        );

        // Decrement old rating count, if needed
        if (oldRating !== null) {
          // previous rating existed
          if (oldRating.feedback === feedback) {
            // No change in feedback, send the old review as response
            return res.status(200).json(oldReview);
          } else {
            oldReview.meta[getCountString(oldRating.feedback)] -= 1;
          }
        }

        // Increment new rating count
        oldReview.meta[getCountString(feedback)] += 1;
      }

      // Update QoI
      oldReview.meta.QoI = calculateQoI({ ...oldReview.meta });

      const updatedReview = await oldReview.save();

      return res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
