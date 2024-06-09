import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import getCommentService from "../../../service/movie/comment/getComment.service";

const getCommentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getCommentService(id);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getCommentController;
