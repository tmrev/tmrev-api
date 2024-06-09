import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import getCommentsService from "../../../service/movie/comment/getComments.service";

const getCommentsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getCommentsService(id);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getCommentsController;
