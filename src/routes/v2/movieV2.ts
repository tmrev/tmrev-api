import { Router } from "express";
import getUserReviewsController from "../../controllers/movie/review/v2/getUserReviews.controller";
import asyncMiddleware from "../../middleware/async.middleware";
import {
  createPinnedMoviesValidation,
  getPinnedMoviesValidation,
  getUserMovieReviewsValidation,
  updatePinnedMoviesValidation,
} from "../../validation/movies";
import createPinnedMoviesControllers from "../../controllers/movie/pinned/createPinnedMovie.controller";
import getPinnedMoviesController from "../../controllers/movie/pinned/getPinnedMovie.controller";
import updatePinnedMoviesControllers from "../../controllers/movie/pinned/updatePinnedMovine.controller";

const router: Router = Router();

const movieV2Router: Router = router;

router.get(
  "/user/review/:userId",
  getUserMovieReviewsValidation(),
  asyncMiddleware(getUserReviewsController)
);

router.post(
  "/pinned",
  createPinnedMoviesValidation(),
  asyncMiddleware(createPinnedMoviesControllers)
);

router.get(
  "/pinned/:uid",
  getPinnedMoviesValidation(),
  asyncMiddleware(getPinnedMoviesController)
);

router.put(
  "/pinned",
  updatePinnedMoviesValidation(),
  asyncMiddleware(updatePinnedMoviesControllers)
);

export default movieV2Router;
