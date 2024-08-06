import { Request, Response } from "express";
import { validationResult } from "express-validator";
import controllerResponse from "../../utils/controllerResponse";
import getUserWatchListsService, {
  UserWatchListQueryType,
} from "../../service/watchLists/v2/getUserWatchLists.service";

const getUserWatchListsController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    const auth = req.headers.authorization as string;
    const { userId } = req.params;

    const query: UserWatchListQueryType = {
      ...(req.query as any),
    };

    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: errors,
      });
    }

    const result = await getUserWatchListsService(userId, query, auth);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getUserWatchListsController;
