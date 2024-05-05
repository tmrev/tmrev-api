import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const topReviewedService = async () => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const result = await db
      .aggregate([
        {
          $group: {
            _id: "$tmdbID",
            count: {
              $sum: 1,
            },
            moviePoster: {
              $first: "$moviePoster",
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
