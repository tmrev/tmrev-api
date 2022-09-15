// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const deleteReviewService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const id = new ObjectId(uuid);

    const movie = await db.findOne({ _id: id });

    if (movie) {
      if (movie.userId === user.uid) {
        await db.deleteOne({ _id: id });

        return {
          success: true,
          body: `Successfully deleted ${id}`,
        };
      }

      return {
        success: false,
        error: "Not authorized to delete this review",
      };
    }

    return {
      success: false,
      error: "Review not found",
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default deleteReviewService;
