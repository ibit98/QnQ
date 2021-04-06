const chalk = require("chalk");
const router = require("express").Router();
const passport = require("passport");

const Auth = require("../../auth");
const Reviews = require("../../../models/reviews");
const Users = require("../../../models/users");

const currentRoute = "/api/users";

// POST new user (auth optional, everyone has access)
router.post("/", Auth.optional, (req, res, next) => {
  console.log(
    chalk.inverse.green("POST") + " : " + chalk.italic.cyan(currentRoute)
  );

  const {
    body: { user },
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser
    .save()
    .then((user) => res.json({ user: user.toAuthJSON() }))
    .catch(next);
});

// POST login (Auth optional, everyone has access)
router.post("/login", Auth.optional, (req, res, next) => {
  console.log(
    chalk.inverse.green("POST") +
      " : " +
      chalk.italic.cyan(currentRoute + "/login")
  );

  const {
    body: { user },
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJSON() });
      }

      return res.status(400).json(info);
    }
  )(req, res, next);
});

// GET currently logged in user, if any
router.get("/me", Auth.optional, (req, res, next) => {
  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(`${currentRoute}/me`)
  );

  if (!req.payload) {
    // No JWT was given, first login from a device
    return res.json({ error: "No JWT" });
  }

  const {
    payload: { id },
  } = req;

  return Users.findById(id).then((user) => {
    if (!user) {
      return res.sendStatus(400);
    }

    return res.json({ user: user.toAuthJSON() });
  });
});

// GET logout user (Auth required, only authenticated users have access)
router.get("/logout", Auth.required, function (req, res) {
  req.logout();
  res.json({
    message: "Logged out successfully",
  });
});

// Get Details of a single User
router.get("/:id", Auth.optional, (req, res, next) => {
  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + "/" + req.params.id)
  );

  // this will return all the data
  Users.findById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

// Get Paginated Reviews done by a single User
router.get("/:id/reviews", (req, res, next) => {
  const resPerPage = 25;
  const page = parseInt(req.query.page) || 1;

  console.log(
    chalk.inverse.blue("GET") +
      "   : " +
      chalk.italic.cyan(currentRoute + "/" + req.params.id + "/reviews")
  );

  if (page < 1) {
    throw Error("Non-positive Page Number");
  }

  Reviews.find({ _creator: req.params.id })
    .skip(resPerPage * (page - 1))
    .limit(resPerPage)
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

module.exports = router;
