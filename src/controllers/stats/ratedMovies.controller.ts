import { Request, Response } from "express";
import ratedUserMoviesService from "../../service/stats/ratedMovies.service";

const ratedUserMoviesController = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const auth = req.headers.authorization || null;

    const result = await ratedUserMoviesService(uid, auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default ratedUserMoviesController;
