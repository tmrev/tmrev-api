import { Request, Response } from "express";
import { validationResult } from "express-validator";
import justReviewedService from "../../../service/movie/review/justReviewed.service";
import controllerResponse from "../../../utils/controllerResponse";

const justReviewedController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await justReviewedService();

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default justReviewedController;
