import { Router } from "express";
import getUserReviewsController from "../../controllers/movie/review/v2/getUserReviews.controller";
import asyncMiddleware from "../../middleware/async.middleware";
import {
  createPinnedMoviesValidation,
  getPinnedMoviesValidation,
  getUserMovieReviewsValidation,
  getUserWatchListsValidation,
  updatePinnedMoviesValidation,
} from "../../validation/movies";
import createPinnedMoviesControllers from "../../controllers/movie/pinned/createPinnedMovie.controller";
import getPinnedMoviesController from "../../controllers/movie/pinned/getPinnedMovie.controller";
import updatePinnedMoviesControllers from "../../controllers/movie/pinned/updatePinnedMovine.controller";
import getUserWatchListsController from "../../controllers/watchLists/getUserWatchLists.controller";
import getWatchListV2Controller from "../../controllers/watchLists/v2/getWatchListV2.controller";

const router: Router = Router();

const movieV2Router: Router = router;

router.get(
  "/user/review/:userId",
  getUserMovieReviewsValidation(),
  asyncMiddleware(getUserReviewsController)
);

router.get(
  "/user/watchlist/:listId",
  asyncMiddleware(getWatchListV2Controller)
);

router.get(
  "/user/:userId/watchlist",
  getUserWatchListsValidation(),
  asyncMiddleware(getUserWatchListsController)
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
