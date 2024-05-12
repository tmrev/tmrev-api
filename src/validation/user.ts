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

export { getUserValidation, getUserFollowersValidation };
