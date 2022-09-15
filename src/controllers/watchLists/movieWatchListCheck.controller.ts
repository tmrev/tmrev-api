import { Request, Response } from "express";
import MovieWatchListCheckService from "../../service/watchLists/movieWatchListCheck.service";

const movieWatchListCheckController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { uuid } = req.params;

    if (!auth) {
      throw new Error("no auth provided");
    }

    if (!uuid) {
      throw new Error("no imdb id provided");
    }

    const result = await MovieWatchListCheckService(auth, Number(uuid));

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default movieWatchListCheckController;
