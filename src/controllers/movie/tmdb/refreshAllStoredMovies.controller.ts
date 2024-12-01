import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import refreshAllStoredMovies from "../../../service/movie/tmdb/refreshAllStoredMovies.service";

const refreshAllStoredMoviesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { batchSize } = req.query;

    const result = await refreshAllStoredMovies(Number(batchSize));

    controllerResponse(res, result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default refreshAllStoredMoviesController;
