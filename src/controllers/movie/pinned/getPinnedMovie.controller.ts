import { Request, Response } from "express";
import getPinnedMoviesService from "../../../service/movie/pinned/getPinnedMovies.service";
import controllerResponse from "../../../utils/controllerResponse";

const getPinnedMoviesController = async (req: Request, res: Response) => {
  try {
    const result = await getPinnedMoviesService(req.params.uid);

    controllerResponse(res, result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default getPinnedMoviesController;
