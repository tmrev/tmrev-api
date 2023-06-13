// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { CreateMoviePayload } from "../../../models/movieReviews";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { getAvg, timestamp } from "../../../utils/common";

const updateReviewService = async (
  authToken: string,
  reviewId: string,
  data: CreateMoviePayload
) => {
  try {
    await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const correctMovieId = await db.findOne({
      _id: new ObjectId(reviewId),
    });

    const brokenMovieId = await db.findOne({
      _id: reviewId,
    });

    const currentMovie = {
      ...correctMovieId,
      ...brokenMovieId,
    };

    // const currentMovie: WithId<MongoMoviePayload | null> = (await db.findOne({
    //   tmdbID: Number(uuid),
    //   userId: user.uid,
    // })) as any;

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

    await db.updateOne({ _id: currentMovie._id }, { $set: payload });

    const result = await db.findOne({ _id: currentMovie._id });

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
