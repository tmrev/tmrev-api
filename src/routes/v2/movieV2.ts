import { Router } from "express";
import getUserReviewsController from "../../controllers/movie/review/v2/getUserReviews.controller";
import asyncMiddleware from "../../middleware/async.middleware";
import { getUserMovieReviewsValidation } from "../../validation/movies";

const router: Router = Router();

const movieV2Router: Router = router;

router.get(
  "/user/review/:userId",
  getUserMovieReviewsValidation(),
  asyncMiddleware(getUserReviewsController)
);

export default movieV2Router;
