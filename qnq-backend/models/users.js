const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create schema for Users
const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "The Name field is required"],
    },
    email: {
      type: String,
      required: [true, "The Email field is required"],
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "unspecified"],
      default: "unspecified",
    },
    hash: String,
    salt: String,
  },
  { emitIndexErrors: true }
);

UsersSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UsersSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      email: this.email,
      id: this._id,
    },
    process.env.JWT_SIGN_SECRET || "secret",
    {
      expiresIn: "2d",
    }
  );
};

UsersSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    gender: this.gender,
    email: this.email,
    token: this.generateJWT(),
  };
};

var handleE11000 = function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Duplicate Unique Key: User Email already exists!"));
  } else {
    next(error);
  }
};

UsersSchema.post("save", handleE11000);

// create model for Users
const Users = mongoose.model("Users", UsersSchema, "Users");

module.exports = Users;
