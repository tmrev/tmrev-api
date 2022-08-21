import { getAuth } from 'firebase-admin/auth';
import { ObjectId } from 'mongodb';
import { client } from '../..';
import { tmrev } from '../../models/mongodb';
import { timestamp } from '../../utils/common';

type WatchList = {
  _id: ObjectId;
  title: string;
  description: string;
  public: boolean;
  movies: any[];
};

export const AddMovieToWatchList = async (
  authToken: string,
  list_id: string,
  data: {
    id: number
  }
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const id = new ObjectId(list_id);

    const watchList = await db.findOne({ _id: id, userId: user.uid });

    if (!watchList) {
      throw new Error('List does not exist');
    }

    const newWatchList = JSON.parse(JSON.stringify(watchList));
    newWatchList.movies.push(data.id);
    newWatchList.updated_at = timestamp()
    if (newWatchList._id) {
      delete newWatchList._id;
    }

    const result = await db.updateOne({ _id: id, userId: user.uid }, { $set: newWatchList });

    return result;
  } catch (err) {
    throw err;
  }
};
