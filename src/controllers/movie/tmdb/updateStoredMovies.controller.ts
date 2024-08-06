import { Request, Response } from "express";
import updateStoredMovies from "../../../service/movie/tmdb/updateStoredMovies.service";
import controllerResponse from "../../../utils/controllerResponse";

const updateStoredMoviesController = async (req: Request, res: Response) => {
  try {
    const { movies } = req.body;

    const result = await updateStoredMovies(movies);

    controllerResponse(res, result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default updateStoredMoviesController;
