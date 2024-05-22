import { client } from "../../..";
import { movieDetailsPipeline } from "../../../constants/pipelines";
import { tmrev } from "../../../models/mongodb";

const justReviewedService = async () => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const count = await db.estimatedDocumentCount();

    const result = await db
      .aggregate([
        {
          $match: {
            public: true,
          },
        },
        ...movieDetailsPipeline,
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 20,
        },
      ])
      .toArray();

    return {
      success: true,
      body: {
        movies: result,
        count,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default justReviewedService;
