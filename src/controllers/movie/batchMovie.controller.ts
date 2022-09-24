import { Request, Response } from "express";
import { validationResult } from "express-validator";
import batchMovie from "../../service/movie/batchMovie.service";
import controllerResponse from "../../utils/controllerResponse";

const batchMovieController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const { movieId } = req.body;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await batchMovie(movieId);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default batchMovieController;
