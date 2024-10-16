import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import getHeatmapInsightsService from "../../../service/movie/insights/getHeatmapInsights.service";

const getHeatmapInsightsController = async (req: Request, res: Response) => {
  try {
    const { days } = req.query;
    const { userId } = req.params;

    const result = await getHeatmapInsightsService(userId, Number(days) || 90);
    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getHeatmapInsightsController;
