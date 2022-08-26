import { client } from "../..";
import { tmrev } from "../../models/mongodb";

type Category =
  | "acting"
  | "characters"
  | "cinematography"
  | "climax"
  | "ending"
  | "music"
  | "personalScore"
  | "plot"
  | "theme"
  | "visuals";

const getUserCategoryMoviesService = async (
  limit: number,
  sort: "-1" | "1",
  category: Category,
  uuid: string
) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.users);
    const cat = `movies.advancedScore.${category}`;

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
          [cat]: Number(sort),
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          title: "$movies.title",
          score: `$${cat}`,
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

export default getUserCategoryMoviesService;
