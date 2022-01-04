import { Request, Response } from 'express';
import { AddMovieToWatchList } from '../../service/watchLists/addMovieToWatchList.service';
import { createWatchListService } from '../../service/watchLists/createWatchList.service';

export const addMovieToWatchListController = async (
  req: Request,
  res: Response
) => {
  try {
    const auth = req.headers.authorization;
    const listId = req.params.listId;
    const body = req.body;

    if (!auth) {
      throw new Error('no auth provided');
    }

    if (!listId) {
      throw new Error('no listId provided');
    }

    if (!body) {
      throw new Error('no body provided');
    }

    const result = await AddMovieToWatchList(auth, listId, body);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
