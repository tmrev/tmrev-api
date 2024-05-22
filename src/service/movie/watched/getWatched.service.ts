import { Document } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { watchedMovieDetailsPipeline } from "../../../constants/pipelines";

const getWatchedService = async (userId: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.watched);

    const pipeline: Document[] = [
      {
        $match: {
          userId,
        },
      },
      ...watchedMovieDetailsPipeline,
    ];

    const result = await db.aggregate(pipeline).toArray();

    return {
      success: true,
      body: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getWatchedService;
