import { CreateMoviePayload } from '../../models/movieReviews';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const createReviewService = async (
  data: CreateMoviePayload
) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db.insertOne(data);

    return result;
  } catch (err) {
    throw err;
  }
};
