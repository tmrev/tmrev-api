import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const getAllWatchListsService = async (authToken: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('Reviews').collection('WatchLists');

    const result = await db.find({userId: user.uid}).toArray();

    return result;
  } catch (err) {
    throw err;
  }
};
