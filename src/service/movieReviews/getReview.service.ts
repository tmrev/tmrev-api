import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const getReviewService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('Reviews').collection('MovieReviews');

    const result = await db.findOne({ tmdbID:Number(uuid), userId: user.uid });

    return result;
  } catch (err) {
    throw err;
  }
};
