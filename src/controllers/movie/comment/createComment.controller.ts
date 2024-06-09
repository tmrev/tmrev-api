import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import createCommentService from "../../../service/movie/comment/createComment.service";

const createCommentController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;

    const { body } = req;
    const { id } = req.params;

    const { comment, contentType } = body;

    const result = await createCommentService(
      id,
      comment,
      contentType,
      auth as string
    );

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default createCommentController;
