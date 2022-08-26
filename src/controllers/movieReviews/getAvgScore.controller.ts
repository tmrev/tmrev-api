import { Request, Response } from "express";
import getAvgScoreService from "../../service/movieReviews/getAvgScore.service";

const getAvgScoreController = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      throw new Error("no uuid provided");
    }

    if (typeof uuid !== "string") {
      throw new Error("incorrect format");
    }

    const result = await getAvgScoreService(Number(uuid));

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getAvgScoreController;
