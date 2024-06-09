import { body, header, param } from "express-validator";

export const validContentType = ["reviews", "comments"];

const createCommentValidation = () => {
  return [
    header("Authorization").isString().exists(),
    param("id").isString(),
    body("comment").isString(),
    body("contentType")
      .isString()
      .withMessage("contentType must be a string.")
      .isIn(validContentType)
      .withMessage(
        `contentType can only be one of these items:${validContentType.map(
          (v) => ` ${v}`
        )}.`
      ),
  ];
};

const voteCommentValidation = () => {
  return [
    header("Authorization").isString().exists(),
    param("id").isString(),
    body("vote").isBoolean().toBoolean().exists(),
  ];
};

const getCommentValidation = () => {
  return [param("id").isString()];
};

const deleteCommentValidation = () => {
  return [param("id").isString(), header("Authorization").isString().exists()];
};

export {
  createCommentValidation,
  getCommentValidation,
  voteCommentValidation,
  deleteCommentValidation,
};
