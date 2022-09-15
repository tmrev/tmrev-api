import { Request, Response } from "express";
import updateReviewService from "../../../service/movie/review/updateReview.service";
import controllerResponse from "../../../utils/controllerResponse";

const updateMovieReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { body } = req;
    const { id } = req.params;

    const result = await updateReviewService(auth, id, body);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default updateMovieReviewController;
