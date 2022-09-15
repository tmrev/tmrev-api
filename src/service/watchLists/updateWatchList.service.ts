// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import { timestamp } from "../../utils/common";

export const updateWatchListService = async (
  authToken: string,
  uuid: string,
  data: unknown
) => {
  try {
    const newData = JSON.parse(JSON.stringify(data));
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const id = new ObjectId(uuid);

    const watchList = await db.findOne({ _id: id });

    newData.updated_at = timestamp();

    if (watchList) {
      if (watchList.userId === user.uid) {
        await db.updateOne({ _id: id }, { $set: newData });
        const result = db.findOne({ _id: id });
        return result;
      }
      throw new Error("Not authorized to edit this Watch List");
    }
    throw new Error("Watch List not found");
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default updateWatchListService;
