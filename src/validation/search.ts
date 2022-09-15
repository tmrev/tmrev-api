import { checkSchema } from "express-validator";

const searchValidationRules = () =>
  checkSchema({
    q: {
      isString: true,
    },
  });

export default searchValidationRules;
