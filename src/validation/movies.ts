import { checkSchema } from "express-validator";

const movieCreateValidationRules = () =>
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

export default movieCreateValidationRules;
