import { Router } from "express";
import followerFeedController from "../controllers/follow/followerFeed.controller";
import followUserController from "../controllers/follow/followUser.controller";
import asyncMiddleware from "../middleware/async.middleware";

const router: Router = Router();

// legacy from https://movielot.vercel.app
// TODO: refactor
router.get("/feed", asyncMiddleware(followerFeedController));

// TODO: move follow into separate router.
router.post("/follow/:uid", asyncMiddleware(followUserController));

const followRouter: Router = router;

export default followRouter;
