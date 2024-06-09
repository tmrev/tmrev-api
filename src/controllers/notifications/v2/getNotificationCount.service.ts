import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import getNotificationCountService from "../../../service/notifications/v2/getNotifcationCount.service";

const getNotificationCountController = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers.authorization as string;

    const result = await getNotificationCountService(authToken);

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default getNotificationCountController;
