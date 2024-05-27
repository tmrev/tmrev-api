import { Request, Response } from "express";
import controllerResponse from "../../../utils/controllerResponse";
import getActorInsightsService from "../../../service/movie/insights/getActorInsights.service";

const getActorInsightsController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await getActorInsightsService(userId);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getActorInsightsController;
