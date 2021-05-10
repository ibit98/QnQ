require("dotenv").config();

export const PORT = process.env.PORT;
export const DB = process.env.DB;
export const NODE_ENV = process.env.NODE_ENV;
let session_secret = process.env.SESSION_SECRET;
let jwt_secret = process.env.JWT_SECRET;

if (!PORT) {
  throw new Error(
    ".env is missing the definition of PORT environmental variable"
  );
}

if (!NODE_ENV) {
  throw new Error(
    ".env is missing the definition of a NODE_ENV environmental variable"
  );
}

if (!DB) {
  throw new Error(".env is missing the definition of DB environment variable");
}

if (!session_secret) {
  if (NODE_ENV === "production") {
    console.warn(
      ".env is missing the definition of SESSION_SECRET. Add it ASAP!"
    );
  }
  session_secret = "session-secret";
}

if (!jwt_secret) {
  if (NODE_ENV === "production") {
    console.warn(".env is missing the definition of JWT_SECRET. Add it ASAP!");
  }
  jwt_secret = "secret";
}

export const SESSION_SECRET = session_secret;
export const JWT_SECRET = jwt_secret;
