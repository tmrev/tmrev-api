import { Request, Response } from 'express';
import { getWatchListService } from '../../service/watchLists/getWatchList.service';

export const getWatchListController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const uuid = req.params.uuid;
    const userId = req.query.user as string;

    if (!uuid) {
      throw new Error('no uuid provided');
    }

    if (typeof uuid !== 'string') {
      throw new Error('incorrect format');
    }

    const result = await getWatchListService(uuid, auth, userId);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
