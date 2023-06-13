import { Router } from "express";
import asyncMiddleware from "../middleware/async.middleware";
import retrieveFollowingController from "../controllers/follow/retrieveFollowing.controller";
import retrieveFollowersController from "../controllers/follow/retrieveFollowers.controller";

const router: Router = Router();

router.get(
  "/:accountId/following",
  asyncMiddleware(retrieveFollowingController)
);

router.get(
  "/:accountId/followers",
  asyncMiddleware(retrieveFollowersController)
);

const followRouter: Router = router;

export default followRouter;
