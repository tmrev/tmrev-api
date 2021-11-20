import { Request, Response } from 'express';
import { searchService } from '../../service/rottenTomatoes/search.service';

type Search = {
  url: string;
  img: string;
  type: string;
  uuid: string;
  year: string;
};

export const searchController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const type = req.query.type as string | undefined;
    const year = req.query.year as string | undefined;

    if (!search) throw Error('search query is required');

    const meta: Search[] = await searchService(
      `https://www.rottentomatoes.com/search?search=${search}`
    );

    let filterData = [...meta];

    if (type) {
      filterData = filterData.filter((value) => value.type === type);
    }

    if (year) {
      filterData = filterData.filter((value) => value.year === year);
    }

    res.send(filterData);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
