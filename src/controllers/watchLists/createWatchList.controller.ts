import { Request, Response } from "express";
import { createWatchListService } from "../../service/watchLists/createWatchList.service";

const createWatchListController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { body } = req;

    if (!auth) {
      throw new Error("no auth provided");
    }

    if (!body) {
      throw new Error("no body provided");
    }

    const result = await createWatchListService(auth, body);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default createWatchListController;
