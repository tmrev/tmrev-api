import { Request, Response } from "express";
import controllerResponse from "../../utils/controllerResponse";
import forgetNotificationService from "../../service/notifications/forgetNotification.service";

const forgetNotificationController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await forgetNotificationService(id as string);

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default forgetNotificationController;
