import { Request, Response } from "express";
import { validationResult } from "express-validator";
import getAllReviewsService from "../../../service/movie/review/getAllReviews.service";
import controllerResponse from "../../../utils/controllerResponse";

const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { movieId } = req.params;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await getAllReviewsService(Number(movieId));

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getAllReviewsController;
