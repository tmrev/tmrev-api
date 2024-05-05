import { getAuth } from "firebase-admin/auth";
import { Document } from "mongodb";
import { client } from "../../../..";
import { tmrev } from "../../../../models/mongodb";

export type UserReviewsQueryType = {
  advancedScore?: {
    category: string;
    score: number;
  };
  pageNumber: number;
  pageSize: number;
  sort_by: string;
};

const convertOrder = (order: "asc" | "desc" | string) => {
  if (order === "asc") return 1;
  if (order === "desc") return -1;

  return 0;
};

const GetUserReviewsService = async (
  userId: string,
  query: UserReviewsQueryType,
  authToken?: string
) => {
  try {
    let firebaseUser;
    const pipeline: Document[] = [];
    const reviewDB = client.db(tmrev.db).collection(tmrev.collection.reviews);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }

    if (query.advancedScore) {
      pipeline.push({
        $match: {
          userId,
          [`advancedScore.${query.advancedScore.category}`]:
            query.advancedScore.score,
        },
      });
    } else {
      // Match the user's reviews
      pipeline.push({
        $match: {
          userId,
        },
      });
    }

    // If the user is not logged in or userId don't match, only return public reviews
    if (!firebaseUser || firebaseUser.uid !== userId) {
      pipeline.push({
        $match: {
          public: true,
        },
      });
    }

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

    const reviews = await reviewDB.aggregate(pipeline).toArray();
    const countResult = await reviewDB.aggregate(countPipeline).toArray();

    const totalCount = countResult[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / query.pageSize);

    return {
      success: true,
      body: {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        totalNumberOfPages,
        totalCount,
        reviews,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default GetUserReviewsService;