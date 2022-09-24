import { Request, Response } from "express";
import { validationResult } from "express-validator";
import createWatchService from "../../../service/movie/watched/createWatched.service";
import controllerResponse from "../../../utils/controllerResponse";

const createWatchedController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const auth = req.headers.authorization;
    const { body } = req;

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await createWatchService(body, auth as string);

    controllerResponse(res, result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default createWatchedController;
