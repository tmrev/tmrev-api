import { header, param, query } from "express-validator";

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

export { getUserValidation, getUserFollowersValidation, getUserFeedValidation };
