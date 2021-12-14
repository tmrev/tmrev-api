import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';
import { MovieDocument } from '../../models/movieReviews';
import commonListElement from '../../utils/commonListElement';

export const favoriteMovieGenreService = async (authToken: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('MovieRatings').collection(user.uid);

    const result: MovieDocument[] = (await db.find({}).toArray()) as any;

    const allGenres = result.map((value) => {
      if (value.rotten) {
        return commonListElement(value.rotten.movieInfo.genre);
      }
    });

    console.log(allGenres);

    return commonListElement(allGenres);
  } catch (err) {
    throw err;
  }
};
