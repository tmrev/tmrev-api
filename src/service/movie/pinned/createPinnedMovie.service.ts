import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

type CreatePinnedMoviesServiceType = {
  movieReviewId: string;
};

const createPinnedMoviesService = async (
  data: CreatePinnedMoviesServiceType,
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

    // make sure the movie review id isn't already in the pinned list
    pinnedMovies.forEach((movieId) => {
      if (movieId.equals(new ObjectId(data.movieReviewId))) {
        throw new Error("Movie already pinned");
      }
    });

    const movie = await client
      .db(tmrev.db)
      .collection(tmrev.collection.reviews)
      .findOne({ _id: new ObjectId(data.movieReviewId) });

    if (!movie) {
      return {
        success: false,
        error: "Movie review not found",
      };
    }

    // make sure the movie review is the user's review
    if (movie.userId !== firebaseUser.uid) {
      return {
        success: false,
        error: "Movie review does not belong to user",
      };
    }

    // make sure the movie review is public
    if (!movie.public) {
      return {
        success: false,
        error: "Movie review is not public",
      };
    }

    pinnedMovies.push(new ObjectId(data.movieReviewId));

    await client
      .db(tmrev.db)
      .collection(tmrev.collection.users)
      .updateOne(
        { uuid: firebaseUser.uid },
        { $set: { pinned: pinnedMovies } }
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

export default createPinnedMoviesService;
