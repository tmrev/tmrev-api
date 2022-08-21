import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';
import { timestamp } from '../../utils/common';

export const updateWatchListService = async (
  authToken: string,
  uuid: string,
  data: any
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const id = new ObjectId(uuid);

    const watchList = await db.findOne({ _id: id })

    data.updated_at = timestamp();

    if (watchList) {
      if (watchList.userId === user.uid) {
        await db.updateOne({ _id: id }, { $set: data });
        const result = db.findOne({ _id: id });
        return result;
      } else {
        throw new Error('Not authorized to edit this Watch List')
      }
    }
  throw new Error('Watch List not found')
    
  } catch (err) {
    throw err;
  }
};
