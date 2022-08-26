import { Request, Response } from "express";
import getAllMovieReviewsService from "../../service/movieReviews/getAllMovieReviews";

const getAllMovieReviewsController = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      throw new Error("no id provided");
    }

    if (typeof uuid !== "string") {
      throw new Error("id is not properly formatted");
    }

    const result = await getAllMovieReviewsService(uuid);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getAllMovieReviewsController;
