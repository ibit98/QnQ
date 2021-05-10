import { Request } from "express";
import jwt from "express-jwt";
import { JWT_SECRET } from "../config/env.dev";

const getTokenFromHeaders = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const Auth = {
  required: jwt({
    secret: JWT_SECRET,
    getToken: getTokenFromHeaders,
    algorithms: ["sha1", "RS256", "HS256"],
  }),
  optional: jwt({
    secret: JWT_SECRET,
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ["sha1", "RS256", "HS256"],
  }),
};

export default Auth;
