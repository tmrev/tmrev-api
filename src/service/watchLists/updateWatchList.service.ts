import { getAuth } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { ObjectId } from 'mongodb';
import { client } from '../..';

export const updateWatchListService = async (
  authToken: string,
  uuid: string,
  data: any
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('WatchLists').collection('collection');

    const id = new ObjectId(uuid);

    data.updated_at = Timestamp.now();

    await db.updateOne({ _id: id }, { $set: data });

    const result = db.findOne({ _id: id });

    return result;
  } catch (err) {
    throw err;
  }
};
