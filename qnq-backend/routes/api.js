const chalk = require('chalk');
const express = require('express');
const router = express.Router();

const User = require ('../models/user');

router.get('/users', (req, res, next) => {
  console.log(chalk.inverse.blue('GET') + '  : ' + chalk.italic.cyan('/api/users'));

  // this will return all the data
  User.find({})
      .then( data => { res.json(data); } )
      .catch(next)
});

router.post('/users', (req, res, next) => {
  console.log(chalk.inverse.green('POST') + ' : ' + chalk.italic.cyan('/api/users'));

  if ((req.body.name) && (req.body.email)) {
    User.create(req.body)
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
