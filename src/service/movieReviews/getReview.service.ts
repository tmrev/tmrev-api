import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const getReviewService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('MovieRatings').collection(user.uid);

    const result = await db.findOne({ uuid });

    return result;
  } catch (err) {
    throw err;
  }
};
