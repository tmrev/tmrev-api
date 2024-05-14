import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const updatePinnedMoviesService = async (
  movieReviewIds: string[],
  authToken: string
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const dbUser = await client
      .db(tmrev.db)
      .collection(tmrev.collection.users)
      .findOne({ uuid: firebaseUser.uid });

    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const pinnedMovies: ObjectId[] = dbUser.pinned || [];

    const newPinnedMovies = movieReviewIds.map((id) => new ObjectId(id));

    // make sure the movie review id isn't already in the pinned list
    if (newPinnedMovies.some((id) => pinnedMovies.includes(id))) {
      return {
        success: false,
        error: "Movie already pinned",
      };
    }

    const movies = await client
      .db(tmrev.db)
      .collection(tmrev.collection.reviews)
      .find({
        _id: { $in: newPinnedMovies },
      })
      .toArray();

    if (movies.length !== newPinnedMovies.length) {
      return {
        success: false,
        error: "Movie review not found",
      };
    }

    const publicMovies = movies.filter((movie) => movie.public);

    if (publicMovies.length !== newPinnedMovies.length) {
      return {
        success: false,
        error: "Movie review is not public",
      };
    }

    await client
      .db(tmrev.db)
      .collection(tmrev.collection.users)
      .updateOne(
        { uuid: firebaseUser.uid },
        { $set: { pinned: newPinnedMovies } }
      );

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default updatePinnedMoviesService;
