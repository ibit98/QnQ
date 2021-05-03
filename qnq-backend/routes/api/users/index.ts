import express, { Request, Response, NextFunction } from "express";
import passport from "passport";

import Auth from "../../auth";
import Reviews from "../../../models/reviews";
import Users, { User } from "../../../models/users";

const router = express.Router();

// POST new user (auth optional, everyone has access)
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  const {
    body: { user },
  }: { body: { user: User & { password: string } } } = req;

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

  console.log(finalUser);

  finalUser.setPassword(user.password);

  return finalUser
    .save()
    .then((finalUser) => res.json({ user: finalUser.toAuthJSON() }))
    .catch(next);
});

// POST login (Auth optional, everyone has access)
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const {
    body: { user },
  }: { body: { user: User & { password: string } } } = req;

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
router.get(
  "/me",
  Auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // No JWT was given, first login from a device
      return res.status(400).json({ error: "No JWT" });
    }

    const id: string = req.user["id"];

    try {
      const user = await Users.findById(id);

      if (!user) {
        return res.status(400).json({ error: `No user with id: ${id}` });
      }

      return res.json({ user: user.toAuthJSON() });
    } catch (e) {
      next(e);
    }
  }
);

// GET logout user (Auth required, only authenticated users have access)
router.get("/logout", Auth.required, function (req: Request, res: Response) {
  req.logout();
  res.json({
    message: "Logged out successfully",
  });
});

// Get Details of a single User
router.get(
  "/:id",
  Auth.optional,
  (req: Request, res: Response, next: NextFunction) => {
    // this will return all the data
    Users.findById(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch(next);
  }
);

// Get Paginated Reviews done by a single User
router.get(
  "/:id/reviews",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = 25;
    const offset = Math.max(parseInt((req.query.offset ?? 0).toString()), 0);

    try {
      const reviews = await Reviews.find({ _creator: req.params.id })
        .skip(offset)
        .limit(limit);

      res.json(reviews);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
