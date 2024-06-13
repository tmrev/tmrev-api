import { Request, Response } from "express";

import isUsernameAvailableService from "../../service/users/isUsernameAvailable.service";
import controllerResponse from "../../utils/controllerResponse";

const isUsernameAvailableController = async (req: Request, res: Response) => {
  try {
    const { username } = req.query as { username: string };

    console.log(username);

    const result = await isUsernameAvailableService(username);

    controllerResponse(res, result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default isUsernameAvailableController;
