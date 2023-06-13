import { Request, Response } from "express";
import controllerResponse from "../../utils/controllerResponse";
import retrieveFollowingService from "../../service/follow/retrieveFollowing.service";

const retrieveFollowingController = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { page, pageSize } = req.query;

    const result = await retrieveFollowingService(
      accountId,
      Number(page),
      Number(pageSize)
    );

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default retrieveFollowingController;
