// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

type UpdateWatchListData = {
  description: string;
  movies: { order: number; tmdbID: number }[];
  public: boolean;
  tags: string[];
  title: string;
};

export const updateWatchListService = async (
  authToken: string,
  watchListId: string,
  data: UpdateWatchListData
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const dbUser = await client
      .db(tmrev.db)
      .collection(tmrev.collection.users)
      .findOne({ uuid: firebaseUser.uid });
    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const id = new ObjectId(watchListId);

    // confirm the user exists
    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const watchList = await db.findOne({ _id: id });

    if (!watchList) {
      return {
        success: false,
        error: "Watchlist not found",
      };
    }

    // confirm the user is the owner of the watchlist
    if (watchList.userId !== dbUser.uuid) {
      return {
        success: false,
        error: "Not the Owner of Watchlist",
      };
    }

    // update the existing watchlist with the new data
    const newWatchList = {
      ...watchList,
      ...data,
      updatedAt: new Date(),
    };

    // update the watchlist
    const result = await db.updateOne({ _id: id }, { $set: newWatchList });

    return {
      success: true,
      result,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default updateWatchListService;
