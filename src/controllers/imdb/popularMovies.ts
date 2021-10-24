import { Request, Response } from 'express';
import { metaDataService } from '../../service/imdb/metaData.service';
import { popularMovies } from '../../service/imdb/popluarMovies';

export const popularMoviesController = async (req: Request, res: Response) => {
  try {
    const meta = await popularMovies();

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
