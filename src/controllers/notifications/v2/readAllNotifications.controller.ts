import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import readAllNotifications from "../../../service/notifications/v2/readAllNotifications.service";

const readAllNotificationsController = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers.authorization as string;

    const result = await readAllNotifications(authToken);

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default readAllNotificationsController;
