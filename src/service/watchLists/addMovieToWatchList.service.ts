import { getAuth } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { ObjectId } from 'mongodb';
import { client } from '../..';

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
    rottenId: string;
    imdbId: string;
    title: string;
    poster: string;
    description: string;
    ratings: any;
  }
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db('WatchLists').collection(user.uid);

    const id = new ObjectId(list_id);

    const watchList = await db.findOne({ _id: id });

    if (!watchList) {
      throw new Error('List does not exist');
    }

    const newWatchList = JSON.parse(JSON.stringify(watchList));
    newWatchList.movies.push(data);
    newWatchList.updated_at = Timestamp.now();
    if (newWatchList._id) {
      delete newWatchList._id;
    }

    const result = await db.updateOne({ _id: id }, { $set: newWatchList });

    return result;
  } catch (err) {
    throw err;
  }
};
