import { model, Schema, Model, Document, NativeError } from "mongoose";

import Reviews, { ReviewDocument } from "./reviews";
import Users, { UserDocument } from "./users";

export interface Rating {
  _rater: string;
  _review: string;
  feedback: "helpful" | "harmful" | "uncertain";
}

// Interface for Rating Schema
export type RatingDocument = Rating & Document;

// For model type
export interface RatingModelInterface extends Model<RatingDocument> {}

// create schema for Ratings
const RatingsSchema = new Schema<RatingDocument, RatingModelInterface>(
  {
    _rater: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      validate: {
        validator: (userId: string) => {
          Users.findOne(
            { _id: userId },
            (err: NativeError, doc: UserDocument) => {
              if (err || !doc) {
                return false;
              }
            }
          );
          return true;
        },
        message: (props) => `${props.value} is not a valid Rating ID!`,
      },
      required: [true, "The Rater field is required"],
    },

    _review: {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
      validate: {
        validator: (reviewId: string) => {
          Reviews.findOne(
            { _id: reviewId },
            (err: NativeError, doc: ReviewDocument) => {
              if (err || !doc) {
                return false;
              }
            }
          );
          return true;
        },
        message: (props) => `${props.value} is not a valid Review ID!`,
      },
      required: [true, "The Review for which this is the rating is required"],
    },

    feedback: {
      type: String,
      enum: ["helpful", "harmful", "uncertain"],
      required: [true, "The feedback is required for the rating"],
    },
  },
  { emitIndexErrors: true }
);

RatingsSchema.index({ _rater: 1, _review: 1 }, { unique: true });

// create model for Ratings
const Ratings: Model<RatingDocument> = model(
  "Ratings",
  RatingsSchema,
  "Ratings"
);

export default Ratings;
