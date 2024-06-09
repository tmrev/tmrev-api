import { Request, Response } from "express";
import controllerResponse from "../../../../utils/controllerResponse";
import generateUserFeedsService from "../../../../service/users/v2/feed/generateUserFeeds.service";

const generateUserFeedsController = async (req: Request, res: Response) => {
  try {
    const result = await generateUserFeedsService();

    controllerResponse(res, result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export default generateUserFeedsController;
