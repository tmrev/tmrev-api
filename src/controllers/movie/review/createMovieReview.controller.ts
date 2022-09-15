import { Request, Response } from "express";
import { validationResult } from "express-validator";
import createReviewService from "../../../service/movie/review/createReview.service";
import controllerResponse from "../../../utils/controllerResponse";

const createMovieReviewController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const auth = req.headers.authorization;
    const { body } = req;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await createReviewService(body, auth as string);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default createMovieReviewController;
