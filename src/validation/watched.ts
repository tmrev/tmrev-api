import { checkSchema, check, query } from "express-validator";

const createWatchedValidation = () => {
  return [check("liked").isBoolean(), check("tmdbID").toInt()];
};

const createWatchedSchema = () => {
  return checkSchema({
    liked: {
      isBoolean: true,
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

const getWatchedValidation = () => {
  return [
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
  ];
};

export { createWatchedSchema, createWatchedValidation, getWatchedValidation };
