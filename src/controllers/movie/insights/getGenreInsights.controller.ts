import { Request, Response } from "express";
import getGenreInsightsService from "../../../service/movie/insights/getGenreInsights.service";
import controllerResponse from "../../../utils/controllerResponse";

const getGenreInsightsController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const result = await getGenreInsightsService(userId);

    controllerResponse(res, result);
  } catch (err: unknown) {
    res.status(500).send(err);
  }
};

export default getGenreInsightsController;
