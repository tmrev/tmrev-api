import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getWatchListV2Service = async (listId: string, authToken?: string) => {
  try {
    let firebaseUser: DecodedIdToken | null = null;

    const listDB = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }

    const watchList = await listDB.findOne({ _id: new ObjectId(listId) });

    if (!watchList) {
      return {
        success: false,
        error: "Watch list not found",
      };
    }

    if (!watchList.public && firebaseUser?.uid !== watchList.userId) {
      return {
        success: false,
        error: "Watch list is not public",
      };
    }

    return {
      success: true,
      body: watchList,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getWatchListV2Service;
