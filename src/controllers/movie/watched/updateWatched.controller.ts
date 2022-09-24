import { Request, Response } from "express";
import updateWatchedService from "../../../service/movie/watched/updateWatched.service";
import controllerResponse from "../../../utils/controllerResponse";

const updateWatchedController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { body } = req;
    const { id } = req.params;

    console.log("endpoint");

    const result = await updateWatchedService(auth, id, body);

    controllerResponse(res, result);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).send(err);
  }
};

export default updateWatchedController;
