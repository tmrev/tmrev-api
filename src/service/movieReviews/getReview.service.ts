// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getReviewService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db.findOne({ tmdbID: Number(uuid), userId: user.uid });

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getReviewService;
