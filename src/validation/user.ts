import { header, param, query, body } from "express-validator";

const getUserValidation = () => {
  return [
    header("Authorization").isString().optional(),
    param("uid").isString().exists(),
  ];
};

const getUserFollowersValidation = () => {
  return [
    header("Authorization").isString().optional(),
    param("uid").isString().exists(),
    query("search").isString().optional(),
  ];
};

const getUserFeedValidation = () => {
  return [
    header("Authorization").isString().optional(),
    query("pageNumber").isNumeric().toInt().isInt().exists(),
    query("pageSize").isNumeric().toInt().isInt().exists(),
  ];
};

const createUserValidation = () => {
  return [
    header("Authorization").isString().exists(),
    body("bio").isString().optional(),
    body("username").isString().exists().toString(),
    body("email").isString().isEmail().exists().toString(),
    body("link").isString().optional().toString(),
    body("location").isString().optional().toString(),
    body("photoUrl").isString().optional().toString(),
    body("public").isBoolean().optional().toBoolean(),
  ];
};

export {
  getUserValidation,
  getUserFollowersValidation,
  getUserFeedValidation,
  createUserValidation,
};
