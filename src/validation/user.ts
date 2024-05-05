import { header, param } from "express-validator";

const getUserValidation = () => {
  return [
    header("Authorization").isString().optional(),
    param("uid").isString().exists(),
  ];
};

// eslint-disable-next-line import/prefer-default-export
export { getUserValidation };
