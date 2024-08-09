import { Document } from "mongodb";
import { client } from "../../../..";
import { tmrev } from "../../../../models/mongodb";
import {
  profileDetailsLookUp,
  profileDetailsProjection,
} from "../../../../constants/pipelines";
import convertOrder from "../../../../utils/convertSortOrder";

type GetReviewsByMovieIdQuery = {
  includeUserReview?: string;
  pageNumber: number;
  pageSize: number;
  sort_by?: string;
};

const getReviewsByMovieIdService = async (
  movieId: string,
  query: GetReviewsByMovieIdQuery
) => {
  try {
    const pipeline: Document[] = [];
    const reviewDB = client.db(tmrev.db).collection(tmrev.collection.reviews);

    pipeline.push({
      $match: {
        tmdbID: Number(movieId),
        public: true,
      },
    });

    pipeline.push(...profileDetailsLookUp);

    const countPipeline = [...pipeline];

    pipeline.push({
      $project: {
        _id: 1,
        userId: 1,
        averagedAdvancedScore: 1,
        notes: 1,
        tmdbID: 1,
        advancedScore: 1,
        public: 1,
        title: 1,
        votes: {
          upVote: { $size: "$votes.upVote" },
          downVote: { $size: "$votes.downVote" },
        },
        createdAt: 1,
        updatedAt: 1,
        reviewedDate: 1,
        ...profileDetailsProjection,
      },
    });

    if (query.sort_by) {
      const [name, order, category] = query.sort_by.split(".");

      if (category) {
        pipeline.push({
          $sort: {
            [`${category}.${name}`]: convertOrder(order),
          },
        });
      } else {
        pipeline.push({
          $sort: {
            [name]: convertOrder(order),
          },
        });
      }
    }

    pipeline.push({
      $skip: query.pageNumber * query.pageSize,
    });

    pipeline.push({
      $limit: query.pageSize,
    });

    countPipeline.push({
      $count: "totalCount",
    });

    const results = await reviewDB.aggregate(pipeline).toArray();

    const countResult = await reviewDB.aggregate(countPipeline).toArray();

    const totalCount = countResult[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / query.pageSize);

    if (query.includeUserReview) {
      // slice the first element of pipeline
      pipeline.shift();

      const newPipeline = [
        {
          $match: { userId: query.includeUserReview, tmdbID: Number(movieId) },
        },
        ...pipeline,
      ];

      const result = await reviewDB.aggregate(newPipeline).toArray();

      return {
        success: true,
        body: {
          pageNumber: query.pageNumber,
          pageSize: query.pageSize,
          totalNumberOfPages,
          totalCount,
          reviews: results,
          includedUserReview: result,
        },
      };
    }

    return {
      success: true,
      body: {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        totalNumberOfPages,
        totalCount,
        reviews: results,
        includedUserReview: query.includeUserReview,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getReviewsByMovieIdService;
