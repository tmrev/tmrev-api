/* eslint-disable prefer-promise-reject-errors */
import {
  body,
  header,
  checkSchema,
  check,
  query,
  param,
} from "express-validator";

export const movieReviewSortList = [
  "averagedAdvancedScore.asc",
  "averagedAdvancedScore.desc",
  "acting.asc.advancedScore",
  "acting.desc.advancedScore",
  "characters.asc.advancedScore",
  "characters.desc.advancedScore",
  "cinematography.asc.advancedScore",
  "cinematography.desc.advancedScore",
  "climax.asc.advancedScore",
  "climax.desc.advancedScore",
  "ending.asc.advancedScore",
  "ending.desc.advancedScore",
  "music.asc.advancedScore",
  "music.desc.advancedScore",
  "personalScore.asc.advancedScore",
  "personalScore.desc.advancedScore",
  "plot.asc.advancedScore",
  "plot.desc.advancedScore",
  "theme.asc.advancedScore",
  "theme.desc.advancedScore",
  "visuals.asc.advancedScore",
  "visuals.desc.advancedScore",
  "reviewedDate.asc",
  "reviewedDate.desc",
  "votes.upVote.asc",
  "votes.upVote.desc",
  "votes.downVote.asc",
  "votes.downVote.desc",
  "runtime.asc.movieDetails",
  "runtime.desc.movieDetails",
  "release_date.asc.movieDetails",
  "release_date.desc.movieDetails",
  "budget.asc.movieDetails",
  "budget.desc.movieDetails",
  "revenue.asc.movieDetails",
  "revenue.desc.movieDetails",
  "createdAt.asc",
  "createdAt.desc",
  "updatedAt.asc",
  "updatedAt.desc",
  "title.asc.movieDetails",
  "title.desc.movieDetails",
];

export const watchlistSortList = [
  "createdAt.asc",
  "createdAt.desc",
  "updatedAt.asc",
  "updatedAt.desc",
  "title.asc",
  "title.desc",
  "movieCount.asc",
  "movieCount.desc",
];

const movieBatchValidation = () => {
  return [check("movieId").isArray()];
};

const movieCreateDataValidation = () => {
  return [
    check("title")
      .isLength({ max: 265 })
      .withMessage("the title must have less then 265 characters")
      .trim(),
    check("public").isBoolean().exists().toBoolean(),
    header("Authorization").isString().exists(),
    body("advancedScore").custom((value) => {
      if (!value.acting) {
        return Promise.reject("acting was not provided");
      }
      if (!value.characters) {
        return Promise.reject("characters was not provided");
      }
      if (!value.cinematography) {
        return Promise.reject("cinematography was not provided");
      }
      if (!value.climax) {
        return Promise.reject("climax was not provided");
      }
      if (!value.ending) {
        return Promise.reject("ending was not provided");
      }
      if (!value.music) {
        return Promise.reject("music was not provided");
      }
      if (!value.personalScore) {
        return Promise.reject("personalScore was not provided");
      }
      if (!value.plot) {
        return Promise.reject("plot was not provided");
      }
      if (!value.theme) {
        return Promise.reject("theme was not provided");
      }
      if (!value.visuals) {
        return Promise.reject("visuals was not provided");
      }
      return true;
    }),
    body("advancedScore.acting").isInt().toInt(),
    body("advancedScore.characters").isInt().toInt(),
    body("advancedScore.cinematography").isInt().toInt(),
    body("advancedScore.climax").isInt().toInt(),
    body("advancedScore.ending").isInt().toInt(),
    body("advancedScore.music").isInt().toInt(),
    body("advancedScore.personalScore").isInt().toInt(),
    body("advancedScore.plot").isInt().toInt(),
    body("advancedScore.theme").isInt().toInt(),
    body("advancedScore.visuals").isInt().toInt(),
  ];
};

const voteReviewValidation = () => {
  return [
    body("vote").isBoolean().toBoolean(),
    header("Authorization").isString().exists(),
  ];
};

const movieCreateSchemaValidationRules = () =>
  checkSchema({
    public: {
      isBoolean: true,
      errorMessage: "Public must be a boolean",
    },
    title: {
      isString: true,
      errorMessage: "Title must be a string",
    },
    Authorization: {
      isString: true,
      in: ["headers"],
      errorMessage: "Authorization is required",
    },
    advancedScore: {
      isObject: true,
      errorMessage: "Advanced Score is required",
    },
    tmdbID: {
      isInt: true,
      errorMessage: "The Move Database ID is required",
      toInt: true,
    },
    reviewedDate: {
      isString: true,
      errorMessage: "Review date is required",
    },
  });

const movieGetValidationRules = () =>
  checkSchema({
    movieId: {
      isNumeric: true,
      in: "params",
      toInt: true,
    },
  });

const movieReviewGetValidationRules = () =>
  checkSchema({
    id: {
      in: "query",
    },
  });

const movieDeleteValidationRules = () =>
  checkSchema({
    Authorization: {
      isString: true,
      in: ["headers"],
      errorMessage: "Authorization is required",
    },
    id: {
      isString: true,
      exists: true,
    },
  });

const movieGetReviewsValidation = () => {
  return [
    query("count")
      .isNumeric()
      .withMessage("count must be a number.")
      .toInt()
      .optional(),
    query("skip")
      .isNumeric()
      .withMessage("skip must be a number.")
      .toInt()
      .optional(),
    query("sort_by")
      .isString()
      .withMessage("sort_by must be a string.")
      .isIn(movieReviewSortList)
      .withMessage(
        `sort_by can only be one of these items:${movieReviewSortList.map(
          (v) => ` ${v}`
        )}.`
      )
      .optional(),
    query("include_user_review")
      .isString()
      .withMessage("include_user must be the users id.")
      .optional(),
  ];
};

const getUserMovieReviewsValidation = () => {
  return [
    header("Authorization").isString().optional(),
    query("pageNumber")
      .isNumeric()
      .withMessage("Page Number must be a number.")
      .toInt()
      .exists(),
    query("pageSize")
      .isNumeric()
      .withMessage("Page Size must be a number.")
      .toInt()
      .exists(),
    query("sort_by")
      .isString()
      .withMessage("sort_by must be a string.")
      .isIn(movieReviewSortList)
      .withMessage(
        `sort_by can only be one of these items:${movieReviewSortList.map(
          (v) => ` ${v}`
        )}.`
      )
      .optional(),
    query("advancedScore").isString().optional(),
  ];
};

const getReviewsByMovieIdSortList = [
  "createdAt.asc",
  "createdAt.desc",
  "updatedAt.asc",
  "updatedAt.desc",
  "averagedAdvancedScore.asc",
  "averagedAdvancedScore.desc",
  "upVote.asc.votes",
  "upVote.desc.votes",
  "downVote.asc.votes",
  "downVote.desc.votes",
];

const getReviewsByMovieIdValidation = () => {
  return [
    param("movieId").isNumeric().exists().toInt(),
    query("includeUserReview").isString().optional(),
    query("pageNumber").isNumeric().exists().toInt(),
    query("pageSize").isNumeric().exists().toInt(),
    query("sort_by")
      .isString()
      .withMessage("sort_by must be a string.")
      .isIn(getReviewsByMovieIdSortList)
      .withMessage(
        `sort_by can only be one of these items:${getReviewsByMovieIdSortList.map(
          (v) => ` ${v}`
        )}.`
      )
      .optional(),
  ];
};

const getReviewsByActorValidation = () => {
  return [
    param("actorId").isNumeric().exists().toInt(),
    param("userId").isString().exists(),
  ];
};

const getUserWatchListsValidation = () => {
  return [
    header("Authorization").isString().optional(),
    query("pageNumber")
      .isNumeric()
      .withMessage("Page Number must be a number.")
      .toInt()
      .exists(),
    query("pageSize")
      .isNumeric()
      .withMessage("Page Size must be a number.")
      .toInt()
      .exists(),
    query("sort_by")
      .isString()
      .withMessage("sort_by must be a string.")
      .isIn(watchlistSortList)
      .withMessage(
        `sort_by can only be one of these items:${watchlistSortList.map(
          (v) => ` ${v}`
        )}.`
      )
      .optional(),
  ];
};

const updatePinnedMoviesValidation = () => {
  return [
    body("movieReviewIds").isArray().exists(),
    header("Authorization").isString().exists(),
  ];
};

const createPinnedMoviesValidation = () => {
  return [
    body("movieReviewId").isString().exists(),
    header("Authorization").isString().exists(),
  ];
};

const getPinnedMoviesValidation = () => {
  return [param("uid").isString().exists()];
};

export {
  movieReviewGetValidationRules,
  movieDeleteValidationRules,
  movieCreateSchemaValidationRules,
  movieGetValidationRules,
  movieCreateDataValidation,
  movieBatchValidation,
  movieGetReviewsValidation,
  voteReviewValidation,
  getUserMovieReviewsValidation,
  getPinnedMoviesValidation,
  createPinnedMoviesValidation,
  updatePinnedMoviesValidation,
  getUserWatchListsValidation,
  getReviewsByActorValidation,
  getReviewsByMovieIdValidation,
};
