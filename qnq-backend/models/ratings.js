const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reviews = require ('./reviews');
const Users = require ('./users');

// create schema for Ratings
const RatingsSchema = new Schema({
  _rater: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    validate: {
      validator: userId => {
        Users.findOne({ '_id': userId }, (err, doc) => {
          if ((err) || (!doc)) {
              return false;
          }
        });
        return true;
      },
      message: props => `${props.value} is not a valid User ID!`
    },
    required: [true, 'The Rater field is required']
  },

  _review: {
    type: Schema.Types.ObjectId,
    ref: 'Reviews',
    validate: {
      validator: reviewId => {
        Reviews.findOne({ '_id': reviewId }, (err, doc) => {
          if ((err) || (!doc)) {
              return false;
          }
        });
        return true;
      },
      message: props => `${props.value} is not a valid Review ID!`
    },
    required: [true, 'The Review for which this is the rating is required']
  },

  feedback: {
    type: String,
    required: [true, 'The Review Title field is required'],
    enum: [ 'helpful', 'harmful', 'uncertain' ],
    required: [true, 'The feedback is required for the rating']
  }
}, { emitIndexErrors: true });

RatingsSchema.index({ _rater: 1, _review: 1 }, { unique: true });

var handleE11000 = function(error, res, next) {
  if ((error.name === 'MongoError') && (error.code === 11000)) {
    next(new Error('Duplicate Unique Key: User has already rated this review!'));
  } else {
    next();
  }
};

RatingsSchema.post('save', handleE11000);

// create model for Ratings
const Ratings = mongoose.model('Ratings', RatingsSchema, 'Ratings');

module.exports = Ratings;
