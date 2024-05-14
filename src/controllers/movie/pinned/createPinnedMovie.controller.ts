import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import createPinnedMoviesService from "../../../service/movie/pinned/createPinnedMovie.service";

const createPinnedMoviesControllers = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { movieReviewId } = req.body as { movieReviewId: string };

    const result = await createPinnedMoviesService({ movieReviewId }, auth);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default createPinnedMoviesControllers;
