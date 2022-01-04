import { Request, Response } from 'express';
import { deleteWatchListService } from '../../service/watchLists/deleteWatchList.service';

export const deleteWatchListController = async (
  req: Request,
  res: Response
) => {
  try {
    const auth = req.headers.authorization;
    const uuid = req.params.uuid;

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!uuid) {
      throw new Error('no uuid provided');
    }

    if (typeof uuid !== 'string') {
      throw new Error('incorrect format');
    }

    const result = await deleteWatchListService(auth, uuid);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
