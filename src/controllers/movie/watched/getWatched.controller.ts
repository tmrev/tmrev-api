import { Request, Response } from "express";
import getWatchedService from "../../../service/movie/watched/getWatched.service";
import controllerResponse from "../../../utils/controllerResponse";

const getWatchedController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getWatchedService(id);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getWatchedController;
