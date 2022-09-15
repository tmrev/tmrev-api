/* eslint-disable prefer-promise-reject-errors */
import { body, header, checkSchema, check } from "express-validator";

const movieCreateDataValidation = () => {
  return [
    check("title")
      .isLength({ max: 265 })
      .withMessage("the title must have less then 265 characters")
      .trim(),
    check("public").isBoolean().exists().toBoolean(),
    check("notes").isString(),
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
  ];
};

const movieCreateSchemaValidationRules = () =>
  checkSchema({
    notes: {
      isString: true,
      errorMessage: "Notes must be a string",
      in: ["body"],
    },
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
    release_date: {
      isString: true,
      errorMessage: "Release date is required",
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

export {
  movieReviewGetValidationRules,
  movieDeleteValidationRules,
  movieCreateSchemaValidationRules,
  movieGetValidationRules,
  movieCreateDataValidation,
};
