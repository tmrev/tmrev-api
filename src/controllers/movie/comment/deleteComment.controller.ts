import { Request, Response } from "express";
import deleteCommentService from "../../../service/movie/comment/deleteComment.service";
import controllerResponse from "../../../utils/controllerResponse";

const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;

    const result = await deleteCommentService(req.params.id, auth);

    controllerResponse(res, result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default deleteCommentController;
