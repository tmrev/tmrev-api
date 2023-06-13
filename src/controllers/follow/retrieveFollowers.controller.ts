import { Request, Response } from "express";
import controllerResponse from "../../utils/controllerResponse";
import retrieveFollowersService from "../../service/follow/retrieveFollowers.service";

const retrieveFollowersController = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { page, pageSize } = req.query;

    const result = await retrieveFollowersService(
      accountId,
      Number(page),
      Number(pageSize)
    );

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default retrieveFollowersController;
