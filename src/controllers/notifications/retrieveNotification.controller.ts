import { Request, Response } from "express";
import controllerResponse from "../../utils/controllerResponse";
import retrieveNotificationService from "../../service/notifications/retrieveNotifications.service";

const retrieveNotificationController = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers.authorization as string;
    const { read } = req.query;

    const result = await retrieveNotificationService(authToken, read as any);

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default retrieveNotificationController;
