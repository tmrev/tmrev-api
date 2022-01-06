import { Request, Response } from 'express';
import { updateWatchListService } from '../../service/watchLists/updateWatchList.service';

export const updateWatchListController = async (
  req: Request,
  res: Response
) => {
  try {
    const auth = req.headers.authorization;
    const body = req.body;
    const uuid = req.params.uuid;

    console.log(auth);

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!body) {
      throw new Error('no body provided');
    }

    if (!uuid) {
      throw new Error('no uuid provided');
    }

    if (typeof uuid !== 'string') {
      throw new Error('incorrect format');
    }

    const result = await updateWatchListService(auth, uuid, body);

    res.send(result);
  } catch (err: any) {
    console.log(err);

    res.status(500).send(err.message);
  }
};
