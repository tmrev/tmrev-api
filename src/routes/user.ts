import { Router } from "express";
import createUserController from "../controllers/users/createUser.controller";

import getUserController from "../controllers/users/getUser.controller";
import getUserCategoryController from "../controllers/users/getUserBestMovies.controller";
import getUserByUidController from "../controllers/users/getUserByUid.controller";
import isUserController from "../controllers/users/isUser.controller";
import searchUserController from "../controllers/users/searchUser.controller";
import updateUserController from "../controllers/users/updateUser.controller";
import asyncMiddleware from "../middleware/async.middleware";
import saveUserDeviceTokenController from "../controllers/users/saveUserDeviceToken.controller";

const router: Router = Router();

// saves a users push notification id
router.post("/device", asyncMiddleware(saveUserDeviceTokenController));

// confirms if user is in db, needed because user could sign-up through
// SSO and we wouldn't have record of them.
router.get("/isUser/:uid", asyncMiddleware(isUserController));

router.get("/search", asyncMiddleware(searchUserController));

// returns all user data
router.get("/full/:uid", asyncMiddleware(getUserController));

// create user
router.post("/", asyncMiddleware(createUserController));

// update user
router.put("/", asyncMiddleware(updateUserController));

// returns sorted list?
// TODO: remove this endpoint
router.get("/:category/:uuid", asyncMiddleware(getUserCategoryController));

// returns just user db entry
router.get("/:uid", asyncMiddleware(getUserByUidController));

const userRouter: Router = router;

export default userRouter;
