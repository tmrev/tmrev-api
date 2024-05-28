import { Document } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { watchedMovieDetailsPipeline } from "../../../constants/pipelines";

export type WatchedQueryType = {
  pageNumber: number;
  pageSize: number;
};

const getWatchedService = async (userId: string, query: WatchedQueryType) => {
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

    pipeline.push({
      $sort: {
        _id: -1,
      },
    });

    const countPipeline = [...pipeline];

    pipeline.push({
      $skip: query.pageNumber * query.pageSize,
    });

    pipeline.push({
      $limit: query.pageSize,
    });

    countPipeline.push({
      $count: "totalCount",
    });

    const result = await db.aggregate(pipeline).toArray();
    const countResult = await db.aggregate(countPipeline).toArray();

    const totalCount = countResult[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / query.pageSize);

    return {
      success: true,
      body: {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        totalNumberOfPages,
        totalCount,
        watched: result,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getWatchedService;
