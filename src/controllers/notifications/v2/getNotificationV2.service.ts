import { Request, Response } from "express";
import getNotificationV2Service from "../../../service/notifications/v2/getNotificationV2.service";
import controllerResponse from "../../../utils/controllerResponse";
import { ContentType } from "../../../models/generalTypes";

const getNotificationV2Controller = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers.authorization as string;
    const { contentType } = req.query;

    const result = await getNotificationV2Service(
      authToken,
      contentType as ContentType
    );

    controllerResponse(res, result);
  } catch (err) {
    res.status(500).send(err);
  }
};

export default getNotificationV2Controller;
