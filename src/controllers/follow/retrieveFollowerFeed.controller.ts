import { Request, Response } from "express";
import controllerResponse from "../../utils/controllerResponse";
import retrieveFollowerFeedService from "../../service/follow/retrieveFollowerFeed.service";

const retrieveFollowerFeedController = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    const result = await retrieveFollowerFeedService(accountId);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default retrieveFollowerFeedController;
