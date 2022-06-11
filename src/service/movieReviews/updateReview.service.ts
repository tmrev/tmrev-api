import { CreateMoviePayload } from '../../models/movieReviews';
import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const updateReviewService = async (
  authToken: string,
  uuid: string,
  data: CreateMoviePayload
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db.updateOne({ tmdbID:uuid, userId: user.uid }, { $set: data });

    return result;
  } catch (err) {
    throw err;
  }
};
