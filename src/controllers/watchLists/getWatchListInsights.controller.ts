import { Request, Response } from "express";
import GetWatchListInsightsService from "../../service/watchLists/getWatchListInsights.service";

const getWatchListInsightsController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { listId } = req.params;

    const result = await GetWatchListInsightsService(listId, auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getWatchListInsightsController;
