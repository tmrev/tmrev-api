import { Request, Response } from 'express';
import { favoriteMovieGenreService } from '../../service/movieReviews/favoriteMovieGenre.service';

export const favoriteMovieGenreController = async (
  req: Request,
  res: Response
) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new Error('no auth provided');
    }

    const result = await favoriteMovieGenreService(auth);

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
