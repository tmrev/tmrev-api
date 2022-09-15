// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { WithId } from "mongodb";
import {
  CreateMoviePayload,
  MongoMoviePayload,
} from "../../../models/movieReviews";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { getAvg, timestamp } from "../../../utils/common";

const updateReviewService = async (
  authToken: string,
  uuid: string,
  data: CreateMoviePayload
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const currentMovie: WithId<MongoMoviePayload | null> = (await db.findOne({
      tmdbID: Number(uuid),
      userId: user.uid,
    })) as any;

    if (!currentMovie) {
      return {
        success: false,
        error: "Movie Review not found",
      };
    }

    const payload = {
      ...currentMovie,
      ...data,
      averagedAdvancedScore: getAvg(data.advancedScore),
      updatedAt: timestamp(),
    };

    await db.updateOne(
      { tmdbID: Number(uuid), userId: user.uid },
      { $set: payload }
    );

    const result = await db.findOne({ tmdbID: Number(uuid), userId: user.uid });

    return {
      success: true,
      body: result,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default updateReviewService;
