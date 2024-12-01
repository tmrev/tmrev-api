import { Request, Response } from "express";
import GetWatchListInsightsService from "../../service/watchLists/getWatchListInsights.service";

const getWatchListInsightsController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { listId } = req.params;
    const { watchProvidersRegion } = req.query;

    const result = await GetWatchListInsightsService(
      listId,
      auth,
      watchProvidersRegion as string | undefined
    );

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getWatchListInsightsController;
