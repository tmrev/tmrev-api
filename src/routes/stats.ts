import { Router } from "express";
import asyncMiddleware from "../middleware/async.middleware";
import ratedUserMoviesController from "../controllers/stats/ratedMovies.controller";
import categoryChartController from "../controllers/stats/categoryChart.controller";
import getUserLeaderBoardController from "../controllers/stats/getUserLeaderBoard.controller";

const router: Router = Router();

// returns top 10 highest and lowest rated movies
router.get("/:uid/ratedMovies", asyncMiddleware(ratedUserMoviesController));

// returns data for all rated categories for a user
router.get("/:uid/categoryRatings", asyncMiddleware(categoryChartController));

// legacy from https://movielot.vercel.app
// TODO: refactor
router.get("/leaderboard", asyncMiddleware(getUserLeaderBoardController));

const statsRouter: Router = router;

export default statsRouter;
