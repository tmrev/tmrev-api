import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { movieDetailsPipeline } from "../../../constants/pipelines";

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
      .aggregate([
        {
          $match: {
            _id: { $in: pinnedMovies },
          },
        },
        ...movieDetailsPipeline,
      ])
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
