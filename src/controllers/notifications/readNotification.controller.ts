import { Request, Response } from "express";
import controllerResponse from "../../utils/controllerResponse";
import readNotificationService from "../../service/notifications/readNotification.service";

const readNotificationController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await readNotificationService(id as string);

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default readNotificationController;
