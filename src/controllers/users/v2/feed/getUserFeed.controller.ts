import { Request, Response } from "express";
import getUserFeedService from "../../../../service/users/v2/feed/getUserFeed.service";
import controllerResponse from "../../../../utils/controllerResponse";

const getUserFeedController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization as string;
    const { query } = req;

    const result = await getUserFeedService(auth, query as any);

    controllerResponse(res, result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default getUserFeedController;
