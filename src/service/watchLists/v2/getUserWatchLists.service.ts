import { getAuth } from "firebase-admin/auth";
import { Document } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { watchListSortedDetails } from "../../../constants/pipelines";
import convertOrder from "../../../utils/convertSortOrder";

export type UserWatchListQueryType = {
  pageNumber: number;
  pageSize: number;
  sort_by: string;
  textSearch?: string;
};

const getUserWatchListsService = async (
  userId: string,
  query: UserWatchListQueryType,
  authToken?: string
) => {
  try {
    let firebaseUser;
    const pipeline: Document[] = [];
    const watchListDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.watchlists);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }

    if (query.textSearch) {
      pipeline.push({
        $match: {
          userId,
          $text: {
            $search: query.textSearch,
          },
        },
      });
    } else {
      pipeline.push({
        $match: {
          userId,
        },
      });
    }

    if (!firebaseUser || firebaseUser.uid !== userId) {
      pipeline.push({
        $match: {
          public: true,
        },
      });
    }

    pipeline.push(...watchListSortedDetails);

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

    const watchlists = await watchListDB.aggregate(pipeline).toArray();
    const countResult = await watchListDB.aggregate(countPipeline).toArray();

    // find watchlist with no movies to include in the response
    const emptyWatchlists = await watchListDB
      .find({
        userId,
        movies: { $size: 0 },
      })
      .toArray();

    // sort watchlist movies
    watchlists.forEach((watchlist) => {
      watchlist.movies.sort(
        (a: { order: number }, b: { order: number }) => a.order - b.order
      );
    });

    const totalCount = countResult[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / query.pageSize);

    return {
      success: true,
      body: {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        totalNumberOfPages,
        totalCount,
        watchlists,
        emptyWatchlists,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getUserWatchListsService;
