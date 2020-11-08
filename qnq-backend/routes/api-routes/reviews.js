const chalk = require('chalk');
const express = require('express');
const router = express.Router();

const Reviews = require ('../../models/reviews');

const currentRoute = '/api/reviews';

// Get Paginated Details of all Reviews
router.get('/', (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  console.log(chalk.inverse.blue('GET') + '  : ' + chalk.italic.cyan(currentRoute + '?page=' + page));

  if (page < 1) {
    throw Error('Non-positive Page Number');
  }

  Reviews.find({})
         .skip(resPerPage * (page - 1))
         .limit(resPerPage)
         .then( data => { res.json(data); } )
         .catch(next)
});

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

// router.delete('/users/:id', (req, res, next) => {
//   // Todo.findOneAndDelete({"_id": req.params.id})
//   //   .then(data => res.json(data))
//   //   .catch(next)
// })

module.exports = router;
