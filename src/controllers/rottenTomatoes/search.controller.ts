import { Request, Response } from 'express';
import { metaScrapService } from '../../service/page/metaScrap.service';
import { searchService } from '../../service/rottenTomatoes/search.service';

export const searchController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    if (!search) throw Error('search query is required');

    const meta = await searchService(
      `https://www.rottentomatoes.com/search?search=${search}`
    );

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
