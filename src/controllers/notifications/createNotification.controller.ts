import { Request, Response } from "express";
import createNotificationService from "../../service/notifications/createNotification.service";
import controllerResponse from "../../utils/controllerResponse";

const createNotificationController = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    const result = await createNotificationService(body);

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default createNotificationController;
