// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import {
  CreateWatchedPayload,
  MongoWatchedPayload,
} from "../../../models/watched";
import updateMovies from "../../../functions/updateMovies";

const createWatchService = async (
  data: CreateWatchedPayload,
  authToken: string
) => {
  try {
    const dbWatched = client.db(tmrev.db).collection(tmrev.collection.watched);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);

    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const dbUser = await dbUsers.findOne({ uuid: firebaseUser.uid });

    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const findWatched = await dbWatched
      .find({ tmdbID: Number(data.tmdbID), userId: firebaseUser.uid })
      .toArray();
    if (findWatched.length) {
      return {
        success: false,
        error: "A Watched already exist for this title",
      };
    }

    updateMovies(data.tmdbID);

    const payload: MongoWatchedPayload = {
      tmdbID: data.tmdbID,
      liked: data.liked,
      public: data.public || true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: firebaseUser.uid,
    };

    const created = await dbWatched.insertOne(payload);

    const result = await dbWatched.findOne({ _id: created.insertedId });

    return {
      success: true,
      body: result,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error,
    };
  }
};

export default createWatchService;
