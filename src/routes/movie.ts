import { Router } from "express";

import asyncMiddleware from "../middleware/async.middleware";
import getMovieController from "../controllers/movie/getMovie.controller";
import {
  movieBatchValidation,
  movieCreateDataValidation,
  movieCreateSchemaValidationRules,
  movieDeleteValidationRules,
  movieGetReviewsValidation,
  movieGetValidationRules,
  movieReviewGetValidationRules,
  voteReviewValidation,
} from "../validation/movies";
import createMovieReviewController from "../controllers/movie/review/createMovieReview.controller";
import deleteMovieReviewController from "../controllers/movie/review/deleteMovieReivew.controller";
import updateMovieReviewController from "../controllers/movie/review/updateMovieReview.controller";
import getMovieReviewController from "../controllers/movie/review/getMovieReview.controller";
import batchMovieController from "../controllers/movie/batchMovie.controller";

import topReviewedController from "../controllers/movie/review/topReviewed.controller";
import justReviewedController from "../controllers/movie/review/justReviewed.controller";
import getAllReviewsController from "../controllers/movie/review/getAllReviews.controller";
import createCommentController from "../controllers/movie/comment/createComment.controller";
import voteReviewController from "../controllers/movie/review/voteReview.controller";

const router: Router = Router();

// up/down vote a movie review
router.post(
  "/review/vote/:id",
  voteReviewValidation(),
  asyncMiddleware(voteReviewController)
);

// given an array of tmdbIds will return tmdb movie details
router.post(
  "/batch",
  movieBatchValidation(),
  asyncMiddleware(batchMovieController)
);

// gets the latest review movies
router.get("/just-reviewed", asyncMiddleware(justReviewedController));

// gets the movies with the most reviews
router.get("/top-reviewed", asyncMiddleware(topReviewedController));

// creates a comment attached to a review
router.post("/review/:id/comment", asyncMiddleware(createCommentController));

// returns movie details from tmdb as well as saved reviews
router.get(
  "/:movieId",
  movieGetValidationRules(),
  asyncMiddleware(getMovieController)
);

// returns all of the reviews for a given movie
// TODO: Clean this up and separate concerns
router.get(
  "/reviews/:movieId",
  movieGetValidationRules(),
  movieGetReviewsValidation(),
  asyncMiddleware(getAllReviewsController)
);

// returns a single review based on the mongodbId
// TODO: Fix all review endpoints to use mongodbId instead of firebase
router.get(
  "/review/:id",
  movieReviewGetValidationRules(),
  asyncMiddleware(getMovieReviewController)
);

// creates a review
router.post(
  "/review",
  movieCreateSchemaValidationRules(),
  movieCreateDataValidation(),
  asyncMiddleware(createMovieReviewController)
);

// deletes a review
router.delete(
  "/review/:id",
  movieDeleteValidationRules(),
  asyncMiddleware(deleteMovieReviewController)
);

// updates a review
router.put(
  "/review/:id",
  movieCreateSchemaValidationRules(),
  movieCreateDataValidation(),
  asyncMiddleware(updateMovieReviewController)
);

const movieRouter: Router = router;

export default movieRouter;
