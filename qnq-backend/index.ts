import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { initialize, session } from "passport";

// import session from "express-session";
import routes from "./routes";
import { PORT, DB, NODE_ENV, SESSION_SECRET } from "./config/env.dev";

const app = express();
app.use(cors());

// Connect to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

if (NODE_ENV === "development") {
  // Set mongoose to debug mode
  mongoose.set("debug", true);

  // Add morgan for request-response logs
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use(json());

// app.use(
//   session({
//     secret: SESSION_SECRET,
//     cookie: { maxAge: 60000 },
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Passport related
app.use(initialize());
app.use(session());
import "./config/passport";

app.use("/", routes);

app.use(function (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  res
    .status(err["status"] || 500)
    .send("Internal Server Error. Contact arijitbiley@gmail.com");
});

app.listen(PORT, () => {
  console.log(`API Server running on PORT ${PORT}`);
});
