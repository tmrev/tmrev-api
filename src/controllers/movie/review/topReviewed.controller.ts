import { Request, Response } from "express";
import { validationResult } from "express-validator";
import topReviewedService from "../../../service/movie/review/topReviewed.service";
import controllerResponse from "../../../utils/controllerResponse";

const topReviewedController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await topReviewedService();

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default topReviewedController;
