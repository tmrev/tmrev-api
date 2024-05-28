import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import getSingleWatchedService from "../../../service/movie/watched/getSingleWatched.service";

const getSingleWatchedController = async (req: Request, res: Response) => {
  try {
    const { userId, movieId } = req.params;

    const result = await getSingleWatchedService(userId, movieId);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getSingleWatchedController;
