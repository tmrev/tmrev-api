import { Router } from "express";
import createUserController from "../controllers/users/createUser.controller";
import followerFeedController from "../controllers/users/followerFeed.controller";
import followUserController from "../controllers/users/followUser.controller";
import getUserController from "../controllers/users/getUser.controller";
import getUserCategoryController from "../controllers/users/getUserBestMovies.controller";
import getUserByUidController from "../controllers/users/getUserByUid.controller";
import getUserLeaderBoardController from "../controllers/users/getUserLeaderBoard.controller";
import getUserTopMoviesController from "../controllers/users/getUserTopMovies.controller";
import isUserController from "../controllers/users/isUser.controller";
import searchUserController from "../controllers/users/searchUser.controller";
import updateUserController from "../controllers/users/updateUser.controller";
import asyncMiddleware from "../middleware/async.middleware";
import saveUserDeviceTokenController from "../controllers/users/saveUserDeviceToken.controller";
import ratedUserMoviesController from "../controllers/users/data/ratedMovies.controller";
import categoryChartController from "../controllers/users/data/categoryChart.controller";

const router: Router = Router();

router.post("/device", asyncMiddleware(saveUserDeviceTokenController));

router.get("/isUser/:uid", asyncMiddleware(isUserController));

router.get("/search", asyncMiddleware(searchUserController));

router.get("/topMovies/:uuid", asyncMiddleware(getUserTopMoviesController));

router.get("/full/:uid", asyncMiddleware(getUserController));

router.get("/follow/feed", asyncMiddleware(followerFeedController));

router.post("/follow/:uid", asyncMiddleware(followUserController));

router.get("/leaderboard", asyncMiddleware(getUserLeaderBoardController));

router.post("/", asyncMiddleware(createUserController));

router.put("/", asyncMiddleware(updateUserController));

router.get("/:uid/ratedMovies", asyncMiddleware(ratedUserMoviesController));

router.get("/:uid/categoryRatings", asyncMiddleware(categoryChartController));

router.get("/:category/:uuid", asyncMiddleware(getUserCategoryController));

router.get("/:uid", asyncMiddleware(getUserByUidController));

const userRouter: Router = router;

export default userRouter;
