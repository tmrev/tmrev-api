import { Request, Response } from "express";
import { appCache } from "../..";

const clearCacheController = async (req: Request, res: Response) => {
  try {
    appCache.flushAll();
    res.send(appCache.getStats());
  } catch (err) {
    res.status(500).send(err);
  }
};

export default clearCacheController;
