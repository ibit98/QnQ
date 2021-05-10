import Reviews from "../models/reviews";
import Ratings from "../models/ratings";
import calculateQoI from "./qoi";

export const repairReviews = async () => {
  try {
    const reviews = await Reviews.find({});

    for (const review of reviews) {
      review.meta.beliefCount = await Ratings.countDocuments({
        _review: review._id,
        feedback: "helpful",
      });
      review.meta.disbeliefCount = await Ratings.countDocuments({
        _review: review._id,
        feedback: "harmful",
      });
      review.meta.uncertaintyCount = await Ratings.countDocuments({
        _review: review._id,
        feedback: "uncertain",
      });

      review.meta.QoI = calculateQoI(review.meta);
      await review.save();
    }
  } catch (e) {
    console.error(e);
  }
};
