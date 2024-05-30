import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { Document, ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { watchListSortedDetails } from "../../../constants/pipelines";

const getWatchListV2Service = async (listId: string, authToken?: string) => {
  try {
    let firebaseUser: DecodedIdToken | null = null;

    const listDB = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }

    const pipeline: Document[] = [
      {
        $match: {
          _id: new ObjectId(listId),
        },
      },
      ...watchListSortedDetails,
    ];

    const watchList = await listDB.aggregate(pipeline).toArray();

    if (!watchList) {
      return {
        success: false,
        error: "Watch list not found",
      };
    }

    if (!watchList[0].public && firebaseUser?.uid !== watchList[0].userId) {
      return {
        success: false,
        error: "Watch list is not public",
      };
    }

    return {
      success: true,
      body: watchList[0],
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getWatchListV2Service;
