const chalk = require('chalk');
const express = require('express');
const router = express.Router();

const Reviews = require ('../../models/reviews');
const Ratings = require ('../../models/ratings');

const currentRoute = '/api/reviews';
const metaStrings = {
  'helpful': 'meta.beliefCount',
  'harmful': 'meta.disbeliefCount',
  'uncertain': 'meta.uncertaintyCount'
}

// Get Paginated Details of all Reviews
router.get('/', (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  console.log(chalk.inverse.blue('GET') + '   : ' + chalk.italic.cyan(currentRoute + '?page=' + page));

  if (page < 1) {
    throw Error('Non-positive Page Number');
  }

  Reviews.find({})
         .skip(resPerPage * (page - 1))
         .limit(resPerPage)
         .then( data => { res.json(data); } )
         .catch(next)
});

// Get Details of a single Review
router.get('/:id', (req, res, next) => {
  console.log(chalk.inverse.blue('GET') + '   : '
              + chalk.italic.cyan(currentRoute + '/' + req.params.id));

  // this will return all the data
  Reviews.findById(req.params.id)
         .then( data => { res.json(data); } )
         .catch(next);
});

// Post a new rating
router.post('/', (req, res, next) => {
  console.log(chalk.inverse.green('POST') + ' : ' + chalk.italic.cyan('/api/reviews'));

  if (req.body.title) {
    Reviews.create(req.body)
           .then(data => res.json(data))
           .catch(next)
  } else {
    res.json({
      error: 'Review Title is missing'
    })
  }
});

// Post a rating for a review
router.post('/:reviewId/rate', (req, res, next) => {
  if ((!req.body.userId) || (!req.body.feedback)) {
    res.json({
      error: 'User ID and/or Feedback is missing'
    })
    throw Error('Inserting Rating: User ID and/or Feedback is missing!');
  }

  if ((req.body.feedback !== 'helpful')
      && (req.body.feedback !== 'harmful')
      && (req.body.feedback !== 'uncertain')) {
    throw Error('Invalid Rating. Must be from (helpful, harmful, uncertain)');
  }

  const feedback = req.body.feedback;
  const reviewId = req.params.reviewId;
  const userId = req.body.userId;

  console.log(
    chalk.inverse.green('POST') + '  : '
    + chalk.italic.cyan(currentRoute + '/' + reviewId + '/rate')
    + ' '
    + chalk.gray(`{userId=${userId}, feedback=${feedback}}`)
  );

  // Reviews.findOne({ _id: reviewId }, (err, doc) => {
  //   if ((err) || (!doc)) {
  //       return false;
  //   }
  // });

  Ratings.findOneAndUpdate(
    { _rater: userId, _review: reviewId },
    { feedback: feedback },
    { upsert: true }
  ).then(data => {
    reviewUpdate = { $inc: {} };

    if (data !== null) {
      // modifying Rating
      // Add update to decrement belief/disbelief/uncertainty count based on previous feedback
      reviewUpdate.$inc[metaStrings[data.feedback]] = -1;
    }

    // Add update to increment belief/disbelief/uncertainty count
    reviewUpdate.$inc[metaStrings[feedback]] =
      (reviewUpdate.$inc[metaStrings[feedback]] || 0) + 1;

    responseData = { rating: data };

    Reviews.findByIdAndUpdate(
      reviewId,
      reviewUpdate,
    ).then(data => {
      responseData.review = data;
    });

    return res.json(responseData);
  }).catch(next);
});

// router.delete('/users/:id', (req, res, next) => {
//   // Todo.findOneAndDelete({"_id": req.params.id})
//   //   .then(data => res.json(data))
//   //   .catch(next)
// })

module.exports = router;
