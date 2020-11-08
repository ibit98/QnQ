const chalk = require('chalk');
const express = require('express');
const router = express.Router();

const Users = require ('../../models/users');
const Reviews = require ('../../models/reviews');

const currentRoute = '/api/users';

// Get Paginated Details of all Users
router.get('/', (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  console.log(chalk.inverse.blue('GET') + '   : ' + chalk.italic.cyan(currentRoute + '?page=' + page));

  if (page < 1) {
    throw Error('Non-positive Page Number');
  }

  Users.find({})
       .skip(resPerPage * (page - 1))
       .limit(resPerPage)
       .then( data => { res.json(data); } )
       .catch(next)
});

// Get Details of a single User
router.get('/:id', (req, res, next) => {
  console.log(chalk.inverse.blue('GET') + '   : ' + chalk.italic.cyan(currentRoute + '/' + req.params.id));

  // this will return all the data
  Users.findById(req.params.id)
       .then( data => { res.json(data); } )
       .catch(next);
});

// Get Paginated Reviews done by a single User
router.get('/:id/reviews', (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  console.log(chalk.inverse.blue('GET') + '   : ' + chalk.italic.cyan(currentRoute + '/' + req.params.id + '/reviews'));

  if (page < 1) {
    throw Error('Non-positive Page Number');
  }

  Reviews.find({ '_creator': req.params.id })
         .skip(resPerPage * (page - 1))
         .limit(resPerPage)
         .then( data => { res.json(data); } )
         .catch(next)
});

router.post('/', (req, res, next) => {
  console.log(chalk.inverse.green('POST') + ' : ' + chalk.italic.cyan(currentRoute));

  if ((req.body.name) && (req.body.email)) {
    Users.create(req.body)
         .then(data => res.json(data))
         .catch(next)
  } else {
    res.json({
      error: 'name and/or email is missing'
    })
  }
});

// router.delete('/users/:id', (req, res, next) => {
//   // Todo.findOneAndDelete({"_id": req.params.id})
//   //   .then(data => res.json(data))
//   //   .catch(next)
// })

module.exports = router;
