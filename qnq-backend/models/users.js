const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for Users
const UsersSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The Name field is required']
  },
  email: {
    type: String,
    required: [true, 'The Email field is required'],
    unique: true
  },
  gender: {
    type: String,
    enum: [ 'male', 'female', 'other', 'unspecified' ],
    default: 'unspecified'
  }
}, { emitIndexErrors: true });

var handleE11000 = function(error, res, next) {
  if ((error.name === 'MongoError') && (error.code === 11000)) {
    next(new Error('Duplicate Unique Key: User Email already exists!'));
  } else {
    next();
  }
};

UsersSchema.post('save', handleE11000);

// create model for Users
const Users = mongoose.model('Users', UsersSchema, 'Users');

module.exports = Users;
