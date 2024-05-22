import { Request, Response } from "express";

import getWatchListV2Service from "../../../service/watchLists/v2/getWatchListV2.service";

const getWatchListV2Controller = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const { listId } = req.params;

    const result = await getWatchListV2Service(listId, auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export default getWatchListV2Controller;
