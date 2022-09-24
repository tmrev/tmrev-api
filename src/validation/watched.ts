import { checkSchema, check } from "express-validator";

const createWatchedValidation = () => {
  return [
    check("liked").isBoolean(),
    check("posterPath").isString().trim(),
    check("title").isString().trim(),
    check("tmdbID").toInt(),
  ];
};

const createWatchedSchema = () => {
  return checkSchema({
    liked: {
      isBoolean: true,
      in: ["body"],
    },
    posterPath: {
      isString: true,
      in: ["body"],
    },
    title: {
      isString: true,
      in: ["body"],
    },
    tmdbID: {
      isNumeric: true,
      in: ["body"],
    },
    Authorization: {
      isString: true,
      in: ["headers"],
      errorMessage: "Authorization is required",
    },
  });
};

export { createWatchedSchema, createWatchedValidation };
