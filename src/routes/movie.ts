import { Router } from "express";

import asyncMiddleware from "../middleware/async.middleware";
import getMovieController from "../controllers/movie/getMovie.controller";
import {
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

const router: Router = Router();

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
