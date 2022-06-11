import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';

export const getAllReviewsService = async (authToken: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db.find({userId: user.uid}).toArray();

    return result;
  } catch (err) {
    throw err;
  }
};
