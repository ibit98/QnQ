import { use } from "passport";
import { Strategy } from "passport-local";

import Users from "../models/users";

use(
  new Strategy(
    {
      usernameField: "user[email]",
      passwordField: "user[password]",
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then((user) => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              message: "email or password is invalid",
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
