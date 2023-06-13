import { Request, Response } from "express";
import followerFeedService from "../../service/follow/followerFeed.service";

const followerFeedController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { limit } = req.query;

    if (!auth) {
      throw new Error("no auth provided");
    }

    if (!limit) {
      throw new Error("no limit provided");
    }

    const result = await followerFeedService(Number(limit), auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default followerFeedController;
