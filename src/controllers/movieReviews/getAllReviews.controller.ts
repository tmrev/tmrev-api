import { Request, Response } from "express";
import getAllReviewsService from "../../service/movieReviews/getAllReviews.service";

const getAllReviewsController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new Error("no auth provided");
    }

    const result = await getAllReviewsService(auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getAllReviewsController;
