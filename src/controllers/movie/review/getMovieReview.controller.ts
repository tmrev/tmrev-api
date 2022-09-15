import { Request, Response } from "express";
import getReviewService from "../../../service/movie/review/getReview.service";
import controllerResponse from "../../../utils/controllerResponse";

const getMovieReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { id } = req.params;

    const result = await getReviewService(auth, id);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getMovieReviewController;
