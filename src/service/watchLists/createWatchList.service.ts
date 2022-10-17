// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import { timestamp } from "../../utils/common";

export type ListData = {
  description: string;
  movies?: number[];
  public: boolean;
  title: string;
};

export const createWatchListService = async (
  authToken: string,
  data: ListData
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const newWatchList = {
      ...data,
      movies: data.movies || [],
      created_at: timestamp(),
      updated_at: timestamp(),
      userId: user.uid,
    };

    const result = await db.insertOne(newWatchList);

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};
