import express from "express";

import usersRouter from "./users";
import reviewsRouter from "./reviews";
import leaderboardRouter from "./leaderboard";
import locationRouter from "./location";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/reviews", reviewsRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/location", locationRouter);

export default router;
