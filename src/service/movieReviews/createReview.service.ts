import { CreateMoviePayload } from '../../models/movieReviews';
import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const createReviewService = async (
  authToken: string,
  data: CreateMoviePayload
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('MovieRatings').collection(user.uid);

    const result = await db.insertOne(data);

    return result;
  } catch (err) {
    throw err;
  }
};
