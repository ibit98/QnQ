import Reviews from "../models/reviews";
import Ratings from "../models/ratings";
import calculateQoI from "./qoi";

export const repairReviews = async () => {
  try {
    const reviews = await Reviews.find({});

    for (const review of reviews) {
      review.meta.beliefCount = await Ratings.where("_review", review._id)
        .where("feedback", "helpful")
        .count();
      review.meta.disbeliefCount = await Ratings.where("_review", review._id)
        .where("feedback", "harmful")
        .count();
      review.meta.uncertaintyCount = await Ratings.where("_review", review._id)
        .where("feedback", "uncertain")
        .count();

      review.meta.QoI = calculateQoI(review.meta);
      await review.save();
    }
  } catch (e) {
    console.error(e);
  }
};
