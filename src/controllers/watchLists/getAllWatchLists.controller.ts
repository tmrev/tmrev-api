import { Request, Response } from "express";
import getAllWatchListsService from "../../service/watchLists/getAllWatchLists.service";

const getAllWatchListsController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new Error("no auth provided");
    }

    const result = await getAllWatchListsService(auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getAllWatchListsController;
