import { Document } from "mongodb";
import { client } from "../../..";
import { watchedMovieDetailsPipelineFunc } from "../../../constants/pipelines";
import { tmrev } from "../../../models/mongodb";

const getSingleWatchedService = async (userId: string, movieId: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.watched);

    const pipeline: Document[] = [
      {
        $match: {
          userId,
          tmdbID: Number(movieId),
        },
      },
      ...watchedMovieDetailsPipelineFunc(true),
    ];

    const result = await db.aggregate(pipeline).toArray();

    return {
      success: true,
      body: result.length > 0 ? result[0] : null,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getSingleWatchedService;
