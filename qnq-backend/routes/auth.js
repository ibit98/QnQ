const jwt = require("express-jwt");

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

const Auth = {
  required: jwt({
    secret: process.env.JWT_SECRET || "secret",
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    algorithms: ["sha1", "RS256", "HS256"],
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET || "secret",
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ["sha1", "RS256", "HS256"],
  }),
};

module.exports = Auth;
