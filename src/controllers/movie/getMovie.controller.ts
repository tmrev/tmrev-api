import { Request, Response } from "express";
import { validationResult } from "express-validator";
import getMovie from "../../service/movie/getMovie";
import controllerResponse from "../../utils/controllerResponse";

const getMovieController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { movieId } = req.params;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await getMovie(Number(movieId));

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getMovieController;
