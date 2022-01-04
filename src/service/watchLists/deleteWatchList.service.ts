import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { client } from '../..';

export const deleteWatchListService = async (
  authToken: string,
  uuid: string
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('WatchLists').collection(user.uid);

    const id = new ObjectId(uuid);

    const result = await db.deleteOne({ _id: id });

    return result;
  } catch (err) {
    throw err;
  }
};
