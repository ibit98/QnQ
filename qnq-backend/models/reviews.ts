import { model, isValidObjectId, Schema, Model, Document } from "mongoose";

import calculateQoI from "../helpers/qoi";

export interface ReviewMeta {
  beliefCount: number;
  disbeliefCount: number;
  uncertaintyCount: number;
  QoI: number;
}

export interface Review {
  _creator: string;
  _location: string;
  title: string;
  text: string;
  score: 1 | 2 | 3 | 4 | 5;
  meta: ReviewMeta;
}

// Interface for Review Schema
export type ReviewDocument = Review & Document;

// For model type
export interface ReviewModelInterface extends Model<ReviewDocument> {}

// schema for Reviews
const ReviewsSchema = new Schema<ReviewDocument, ReviewModelInterface>(
  {
    _creator: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "The Creator field is required"],
    },

    _location: {
      type: String,
      required: [true, "The Location field is required"],
    },

    title: {
      type: String,
      required: [true, "The Review Title field is required"],
    },

    text: String,

    score: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
      required: [true, "The Score field is required"],
    },

    meta: {
      beliefCount: {
        type: Number,
        min: 0,
        default: 0,
      },
      disbeliefCount: {
        type: Number,
        min: 0,
        default: 0,
      },
      uncertaintyCount: {
        type: Number,
        min: 0,
        default: 0,
      },
      QoI: {
        type: Number,
        default: function () {
          return calculateQoI({
            beliefCount: this.meta.beliefCount,
            disbeliefCount: this.meta.disbeliefCount,
            uncertaintyCount: this.meta.uncertaintyCount,
          });
        },
        get: function (qoi) {
          console.log(`in getter, with ${qoi}`);
          return calculateQoI({
            beliefCount: this.meta.beliefCount,
            disbeliefCount: this.meta.disbeliefCount,
            uncertaintyCount: this.meta.uncertaintyCount,
          });
        },
        set: function (qoi) {
          console.log(`in setter, with ${qoi}`);
          return calculateQoI({
            beliefCount: this.meta.beliefCount,
            disbeliefCount: this.meta.disbeliefCount,
            uncertaintyCount: this.meta.uncertaintyCount,
          });
        },
      },
    },
  },
  {
    emitIndexErrors: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ReviewsSchema.index({ _creator: 1, _location: 1 }, { unique: true });

// create model for Reviews
const Reviews: Model<ReviewDocument> = model(
  "Reviews",
  ReviewsSchema,
  "Reviews"
);

export default Reviews;

export const getReviewById = async (reviewId: string) => {
  if (!isValidObjectId(reviewId)) {
    console.warn(`Review with id ${reviewId} not found!`);
    return null;
  }

  try {
    const review = await Reviews.findById(reviewId);

    return review;
  } catch (error) {
    // If the error is caused due to invalid Review ID being requested,
    // return Response Status 404: Not found
    if (error.name === "CastError") {
      console.warn(`Review with id ${reviewId} not found!`);
    }
  }

  return null;
};
