import { ObjectId } from "mongodb";
import { getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { CreateWatchedPayload } from "../../../models/watched";
import updateMovies from "../../../functions/updateMovies";

const updateWatchedService = async (
  authToken: string,
  watchedId: string,
  data: CreateWatchedPayload
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watched);
    const dbUser = client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await dbUser.findOne({ uuid: firebaseUser.uid });

    if (!firebaseUser || !user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const id = new ObjectId(watchedId);

    const currentWatched = await db.findOne({ _id: id });

    if (!currentWatched) {
      return {
        success: false,
        error: "Movie Could not be found",
      };
    }

    if (currentWatched.userId !== user.uuid) {
      return {
        success: false,
        error: "User does not have permission to update this movie",
      };
    }

    updateMovies(data.tmdbID);

    const payload = {
      ...currentWatched,
      ...data,
      updatedAt: new Date(),
    };

    await db.updateOne({ _id: id }, { $set: payload });

    const result = await db.findOne({ _id: id });

    return {
      success: true,
      body: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
};

export default updateWatchedService;
