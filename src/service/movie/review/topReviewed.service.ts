import { client } from "../../..";
import { movieDetailsPipeline } from "../../../constants/pipelines";
import { tmrev } from "../../../models/mongodb";

const topReviewedService = async () => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const result = await db
      .aggregate([
        ...movieDetailsPipeline,
        {
          $group: {
            _id: "$tmdbID",
            count: {
              $sum: 1,
            },
            moviePoster: {
              $first: "$movieDetails.poster_path",
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray();

    return {
      success: true,
      body: result,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default topReviewedService;
