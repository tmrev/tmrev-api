import { checkSchema, header, body } from "express-validator";

const watchListUpdateValidationRules = () =>
  checkSchema({
    description: {
      isString: true,
      errorMessage: "Description must be a string",
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
    movies: {
      isArray: true,
      errorMessage: "Movies is required",
    },
  });

const addMovieToWatchListValidationRules = () => {
  return [
    header("Authorization").isString().exists(),
    body("data.id").isNumeric().toInt().exists(),
  ];
};

export { watchListUpdateValidationRules, addMovieToWatchListValidationRules };

export default watchListUpdateValidationRules;
