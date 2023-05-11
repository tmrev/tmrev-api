import { Request, Response } from "express";
import { validationResult } from "express-validator";
import controllerResponse from "../../../utils/controllerResponse";
import createCommentService from "../../../service/movie/comment/createComment.service";

const createCommentController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const auth = req.headers.authorization;

    console.log(auth);

    const { body } = req;
    const { id } = req.params;

    const { comment } = body;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await createCommentService(id, comment, auth as string);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default createCommentController;
