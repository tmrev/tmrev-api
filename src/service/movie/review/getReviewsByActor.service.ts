import { Document } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { movieDetailsPipeline } from "../../../constants/pipelines";

const getUserReviewsByActorService = async (
  actorId: number,
  userId: string
) => {
  try {
    const pipeline: Document[] = [
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "tmdbID",
          foreignField: "id",
          as: "movieDetails",
        },
      },
      {
        $unwind: {
          path: "$movieDetails",
        },
      },
      {
        $match: {
          "movieDetails.credits.cast.id": actorId,
        },
      },
    ];

    pipeline.push(...movieDetailsPipeline);

    const reviewDB = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const reviews = await reviewDB.aggregate(pipeline).toArray();

    return {
      success: true,
      reviews,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getUserReviewsByActorService;
