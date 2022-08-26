// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getWatchListService = async (uuid: string, authToken?: string) => {
  try {
    if (authToken) {
      const user = await getAuth().verifyIdToken(authToken);

      const id = new ObjectId(uuid);

      const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

      const result = await db.findOne({ _id: id });

      if (!result) throw new Error("Watchlist is either private or removed");

      if (result.public) {
        return result;
      }
      if (result.userId === user.uid) {
        return result;
      }
      throw new Error("Watchlist is either private or removed");
    } else {
      const id = new ObjectId(uuid);
      const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

      const result = await db.findOne({ _id: id, public: true });

      if (!result) {
        throw new Error("Watchlist is either private or removed");
      }

      return result;
    }
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getWatchListService;
