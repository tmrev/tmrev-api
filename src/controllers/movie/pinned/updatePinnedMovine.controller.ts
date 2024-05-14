import { Request, Response } from "express";
import updatePinnedMoviesService from "../../../service/movie/pinned/updatePinnedMovies.service";
import controllerResponse from "../../../utils/controllerResponse";

const updatePinnedMoviesControllers = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { movieReviewIds } = req.body as { movieReviewIds: string[] };

    const result = await updatePinnedMoviesService(movieReviewIds, auth);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default updatePinnedMoviesControllers;
