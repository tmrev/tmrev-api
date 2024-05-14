import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getPinnedMoviesService = async (userId: string) => {
  try {
    const dbUser = await client
      .db(tmrev.db)
      .collection(tmrev.collection.users)
      .findOne({ uuid: userId });

    if (!dbUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const pinnedMovies: ObjectId[] = dbUser.pinned || [];

    const movies = await client
      .db(tmrev.db)
      .collection(tmrev.collection.reviews)
      .find({
        _id: { $in: pinnedMovies },
      })
      .toArray();

    return {
      success: true,
      body: movies,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getPinnedMoviesService;
