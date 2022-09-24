// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import {
  CreateWatchedPayload,
  MongoWatchedPayload,
} from "../../../models/watched";
import { timestamp } from "../../../utils/common";

const createWatchService = async (
  data: CreateWatchedPayload,
  authToken: string
) => {
  try {
    const dbWatched = client.db(tmrev.db).collection(tmrev.collection.watched);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);

    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const dbUser = await dbUsers.findOne({ uuid: firebaseUser.uid });

    const findWatched = await dbWatched
      .find({ tmdbID: Number(data.tmdbID) })
      .toArray();

    if (findWatched.length) {
      return {
        success: false,
        error: "A Watched already exist for this title",
      };
    }

    const payload: MongoWatchedPayload = {
      ...data,
      createdAt: timestamp(),
      updatedAt: timestamp(),
      userId: firebaseUser.uid,
      user: dbUser?._id,
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
