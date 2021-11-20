import { Request, Response } from 'express';
import { set } from '../..';
import { popularMovies } from '../../service/imdb/popluarMovies';

export const popularMoviesController = async (req: Request, res: Response) => {
  try {
    const meta = await popularMovies();

    set(req.route.path, meta);

    res.send(meta);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
