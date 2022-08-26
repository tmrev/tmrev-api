import { Request, Response } from "express";
import createReviewService from "../../service/movieReviews/createReview.service";

const createReviewController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { body } = req;

    const result = await createReviewService(body, auth as string);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default createReviewController;
