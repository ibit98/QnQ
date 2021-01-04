const bodyParser = require("body-parser");
const chalk = require("chalk");
require("dotenv").config();
// const errorHandler = require('errorhandler');
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const routes = require("./routes");

// Configure isProduction variable
const isDevelopment = process.env.NODE_ENV === "development";

const app = express();

const port = process.env.PORT || 5000;

// Connect to the database
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Database connected successfully`))
  .catch(err => console.log(err));
// mongoose.set("debug", true);

// since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "session-secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// if(!isProduction) {
//   app.use(errorHandler());
// }
//
app.use("/", routes);

// if (!isProduction) {
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message
  });

  console.log(chalk.red(err.message));
  console.log(err);
  next();
});
// }

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
