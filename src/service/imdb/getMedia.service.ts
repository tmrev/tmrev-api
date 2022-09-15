import { client } from "../..";
import { imdb } from "../../models/mongodb";

const getImdbMovie = async (uid: string) => {
  try {
    const db = client.db(imdb.db).collection(imdb.collection.basic);

    const pipeline = [
      {
        $match: {
          uid,
        },
      },
      {
        $lookup: {
          from: imdb.collection.ratings,
          localField: "uid",
          foreignField: "uid",
          as: "rating",
        },
      },
      {
        $unwind: {
          path: "$rating",
        },
      },
      {
        $project: {
          uid: "$uid",
          titleType: "$titleType",
          primaryTitle: "$primaryTitle",
          originalTitle: "$originalTitle",
          isAdult: "$isAdult",
          startYear: "$startYear",
          endYear: "$endYear",
          runtimeMinutes: "$runtimeMinutes",
          genres: "$genres",
          averageRating: "$rating.averageRating",
          numVotes: "$rating.numVotes",
        },
      },
    ];

    const results = await db.aggregate(pipeline).toArray();

    return results[0] || null;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getImdbMovie;
