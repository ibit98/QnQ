const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for User
const UserSchema = new Schema({
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
    next(new Error('User Email already exists!'));
  } else {
    next();
  }
};

UserSchema.post('save', handleE11000);

// create model for User
const User = mongoose.model('User', UserSchema, 'User');

module.exports = User;
