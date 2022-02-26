import { CreateMoviePayload } from '../../models/movieReviews';
import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const updateReviewService = async (
  authToken: string,
  uuid: string,
  data: CreateMoviePayload
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('Reviews').collection('MovieReviews');

    const result = await db.updateOne({ tmdbID:uuid, userId: user.uid }, { $set: data });

    return result;
  } catch (err) {
    throw err;
  }
};
