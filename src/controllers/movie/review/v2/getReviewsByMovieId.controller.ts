import { Request, Response } from "express";
import controllerResponse from "../../../../utils/controllerResponse";
import getReviewsByMovieIdService from "../../../../service/movie/review/v2/getReviewsByMovieId.service";

const getReviewsByMovieIdController = async (req: Request, res: Response) => {
  try {
    const result = await getReviewsByMovieIdService(
      req.params.movieId,
      req.query as any
    );

    controllerResponse(res, result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default getReviewsByMovieIdController;
