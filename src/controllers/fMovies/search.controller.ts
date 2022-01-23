import { Request, Response } from 'express';
import { searchService } from '../../service/fmovies/search.service';

export const searchController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    if (!search) throw Error('search query is required');

    const meta = await searchService(
      `https://fmoviesto.cc/search/${search.replace(/\s/g, '-')}`,
      req.route.path
    );

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
