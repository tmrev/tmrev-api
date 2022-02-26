import { CreateMoviePayload } from '../../models/movieReviews';
import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const createReviewService = async (
  data: CreateMoviePayload
) => {
  try {
    const db = client.db('Reviews').collection('MovieReviews');

    const result = await db.insertOne(data);

    return result;
  } catch (err) {
    throw err;
  }
};
