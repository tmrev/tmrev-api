// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const deleteWatchListService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const id = new ObjectId(uuid);

    const watchList = await db.findOne({ _id: id });

    if (watchList) {
      if (watchList.userId === user.uid) {
        const result = await db.deleteOne({ _id: id });

        return result;
      }
      throw new Error("Not authorized to delete this Watch List");
    }

    throw new Error("Watch List not found");
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default deleteWatchListService;
