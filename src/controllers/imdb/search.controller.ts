import { Request, Response } from 'express';
import { set } from '../..';
import { searchService } from '../../service/imdb/search.service';

export const searchController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    if (!search) throw Error('search query is required');

    const meta = await searchService(
      `https://www.imdb.com/find?q=${search}`,
      req.route.path
    );

    set(`${req.route.path}/${search}`, meta);

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
