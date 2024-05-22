import { ObjectId, WithId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import {
  CreateWatchedPayload,
  MongoWatchedPayload,
} from "../../../models/watched";
import updateMovies from "../../../functions/updateMovies";

const updateWatchedService = async (
  authToken: string,
  watchedId: string,
  data: CreateWatchedPayload
) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.watched);

    const id = new ObjectId(watchedId);

    const currentWatched: WithId<MongoWatchedPayload | null> =
      (await db.findOne({
        _id: id,
      })) as any;

    if (!currentWatched) {
      return {
        success: false,
        error: "Movie Could not be found",
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
