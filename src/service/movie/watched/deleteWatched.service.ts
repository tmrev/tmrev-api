// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const deleteWatchedService = async (authToken: string, watchedId: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watched);

    const id = new ObjectId(watchedId);

    const watched = await db.findOne({ _id: id });

    if (watched) {
      if (watched.userId === user.uid) {
        await db.deleteOne({ _id: id });

        return {
          success: true,
          body: `Successfully deleted ${id}`,
        };
      }

      return {
        success: false,
        error: "Not authorized to delete this watched",
      };
    }

    return {
      success: false,
      error: "Watched not found",
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default deleteWatchedService;
