import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { client } from '../..';

export const getWatchListService = async (
  uuid: string,
  authToken?: string,
  userId?: string
) => {
  try {
    if (!userId && !authToken) {
      throw new Error('Must provide either AuthToken or UserId');
    }

    const user = async () => await getAuth().verifyIdToken(authToken || '');

    const db = client.db('WatchLists').collection('collection');

    const id = new ObjectId(uuid);

    const result = await db.findOne({ userId: userId || (await user()).uid, _id: id });

    if (userId && result && result.public === false) {
      throw new Error('Watchlist is either private or removed');
    }

    return result;
  } catch (err) {
    throw err;
  }
};
