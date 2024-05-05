import { Router } from "express";
import getUserV2Controller from "../../controllers/users/v2/getUserV2.controller";
import asyncMiddleware from "../../middleware/async.middleware";
import { getUserValidation } from "../../validation/user";
import followUserV2Controller from "../../controllers/users/v2/followUserV2.controller";
import unfollowUserV2Controller from "../../controllers/users/v2/unfollowUserV2.controller";

const router: Router = Router();

router.get("/:uid", getUserValidation(), asyncMiddleware(getUserV2Controller));

router.post("/follow/:uid", asyncMiddleware(followUserV2Controller));

router.post("/unfollow/:uid", asyncMiddleware(unfollowUserV2Controller));

const userV2Router: Router = router;

export default userV2Router;
