// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { CreateMoviePayload } from "../../models/movieReviews";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const updateReviewService = async (
  authToken: string,
  uuid: string,
  data: CreateMoviePayload
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db.updateOne(
      { tmdbID: uuid, userId: user.uid },
      { $set: data }
    );

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default updateReviewService;
