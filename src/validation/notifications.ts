import { body, checkSchema, header, oneOf, query } from "express-validator";

const createTypes = ["downVote", "reply", "upVote"];

const createNotificationValidation = () => {
  return [
    body("recipient").isString().exists(),
    body("reviewId").isString().exists(),
    body("sender").isString().exists(),
    header("Authorization").isString().exists(),
    body("type")
      .isString()
      .withMessage("type must be a string.")
      .isIn(createTypes)
      .withMessage(
        `sort_by can only be one of these items:${createTypes.map(
          (v) => ` ${v}`
        )}.`
      ),
    // Conditionally validate the 'review' object if type is 'reply'
    oneOf([
      // if type is not 'reply', 'review' field is not necessary
      body("type").not().equals("reply"),
      // if type is 'reply', 'review' field must be an object with 'id' and 'message' fields
      checkSchema({
        "reply.id": {
          in: ["body"],
          errorMessage: "review.id must be a string",
          isString: true,
          exists: true,
        },
        "reply.message": {
          in: ["body"],
          errorMessage: "review.message must be a string",
          isString: true,
          exists: true,
        },
      }),
    ]),
  ];
};

const retrieveNotificationValidation = () => {
  return [
    header("Authorization").isString().exists(),
    query("read").isBoolean().toBoolean().optional(),
  ];
};

export { createNotificationValidation, retrieveNotificationValidation };
