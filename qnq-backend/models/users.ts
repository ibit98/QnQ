import crypto from "crypto";
import jwt from "jsonwebtoken";
import { model, Schema, Model, Document } from "mongoose";

export interface User {
  name: string;
  email: string;
  hash: string;
  salt: string;
  setPassword: (_1: string) => void;
  validatePassword: (_1: string) => boolean;
  generateJWT: () => string;
  toAuthJSON: () => {
    _id: string;
    name: string;
    email: string;
    token: string;
  };
}

// Interface for User Schema
export type UserDocument = User & Document;

// For model type
export interface UserModelInterface extends Model<UserDocument> {}

// create schema for Users
const UsersSchema = new Schema<UserDocument, UserModelInterface>(
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
    hash: String,
    salt: String,
  },
  { emitIndexErrors: true }
);

UsersSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UsersSchema.methods.validatePassword = function (password: string) {
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
    email: this.email,
    token: this.generateJWT(),
  };
};

// create model for Users
const Users: Model<UserDocument> = model("Users", UsersSchema, "Users");

export default Users;
