import { Request, Response } from 'express';
import { searchWatchListService } from '../../service/watchLists/searchWatchList.service';

export const searchWatchListController = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    const {q } = req.query

    if (!q) {
      throw new Error('no search provided');
    }

    if (typeof q !== 'string') {
      throw new Error('incorrect format');
    }

    const result = await searchWatchListService(q)

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
