// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getAllWatchListsService = async (authToken: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const result = await db.find({ userId: user.uid }).toArray();

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getAllWatchListsService;
