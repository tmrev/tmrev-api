import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const getAllMovieReviewsService = async (tmdbID: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db.find({tmdbID: Number(tmdbID), public: true}).toArray();

    return result;
  } catch (err) {
    throw err;
  }
};
