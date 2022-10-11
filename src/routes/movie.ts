import { Router } from "express";

import asyncMiddleware from "../middleware/async.middleware";
import getMovieController from "../controllers/movie/getMovie.controller";
import {
  movieBatchValidation,
  movieCreateDataValidation,
  movieCreateSchemaValidationRules,
  movieDeleteValidationRules,
  movieGetValidationRules,
  movieReviewGetValidationRules,
} from "../validation/movies";
import createMovieReviewController from "../controllers/movie/review/createMovieReview.controller";
import deleteMovieReviewController from "../controllers/movie/review/deleteMovieReivew.controller";
import updateMovieReviewController from "../controllers/movie/review/updateMovieReview.controller";
import getMovieReviewController from "../controllers/movie/review/getMovieReview.controller";
import batchMovieController from "../controllers/movie/batchMovie.controller";
import deleteWatchedController from "../controllers/movie/watched/deleteWatched.controller";
import createWatchedController from "../controllers/movie/watched/createWatched.controller";
import getWatchedController from "../controllers/movie/watched/getWatched.controller";
import updateWatchedController from "../controllers/movie/watched/updateWatched.controller";
import {
  createWatchedSchema,
  createWatchedValidation,
} from "../validation/watched";
import topReviewedController from "../controllers/movie/review/topReviewed.controller";
import justReviewedController from "../controllers/movie/review/justReviewed.controller";

const router: Router = Router();

router.post(
  "/batch",
  movieBatchValidation(),
  asyncMiddleware(batchMovieController)
);

router.post(
  "/watched",
  createWatchedSchema(),
  createWatchedValidation(),
  asyncMiddleware(createWatchedController)
);

router.get("/watched/:id", asyncMiddleware(getWatchedController));

router.put("/watched/:id", asyncMiddleware(updateWatchedController));

router.delete("/watched/:id", asyncMiddleware(deleteWatchedController));

router.get("/just-reviewed", asyncMiddleware(justReviewedController));

router.get("/top-reviewed", asyncMiddleware(topReviewedController));

router.get(
  "/:movieId",
  movieGetValidationRules(),
  asyncMiddleware(getMovieController)
);

router.get(
  "/review/:id",
  movieReviewGetValidationRules(),
  asyncMiddleware(getMovieReviewController)
);

router.post(
  "/review",
  movieCreateSchemaValidationRules(),
  movieCreateDataValidation(),
  asyncMiddleware(createMovieReviewController)
);

router.delete(
  "/review/:id",
  movieDeleteValidationRules(),
  asyncMiddleware(deleteMovieReviewController)
);

router.put(
  "/review/:id",
  movieCreateSchemaValidationRules(),
  movieCreateDataValidation(),
  asyncMiddleware(updateMovieReviewController)
);

const movieRouter: Router = router;

export default movieRouter;
