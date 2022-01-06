import { getAuth } from 'firebase-admin/auth';
import { client } from '../..';

export const getAllWatchListsService = async (authToken: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('WatchLists').collection(user.uid);

    const result = await db.find({}).toArray();

    return result;
  } catch (err) {
    throw err;
  }
};
