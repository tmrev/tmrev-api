import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getUserTopMoviesService = async (
  limit: number,
  sort: "-1" | "1",
  uuid: string
) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const pipeline = [
      {
        $match: {
          uuid,
        },
      },
      {
        $lookup: {
          from: tmrev.collection.reviews,
          localField: "uuid",
          foreignField: "userId",
          as: "movies",
        },
      },
      {
        $unwind: {
          path: "$movies",
        },
      },
      {
        $match: {
          "movies.public": true,
        },
      },
      {
        $sort: {
          "movies.averagedAdvancedScore": Number(sort),
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: "$movies.title",
          score: "$movies.averagedAdvancedScore",
          tmdbID: "$movies.tmdbID",
          reviewedDate: "$movies.reviewedDate",
          createdAt: "$movies.createdAt",
          notes: "$movies.notes",
        },
      },
    ];

    const results = await db.aggregate(pipeline).toArray();

    return results;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getUserTopMoviesService;
