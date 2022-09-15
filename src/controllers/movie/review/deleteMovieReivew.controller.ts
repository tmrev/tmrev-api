import { Request, Response } from "express";
import { validationResult } from "express-validator";
import deleteReviewService from "../../../service/movie/review/deleteReview.service";
import controllerResponse from "../../../utils/controllerResponse";

const deleteMovieReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await deleteReviewService(auth, id);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default deleteMovieReviewController;
