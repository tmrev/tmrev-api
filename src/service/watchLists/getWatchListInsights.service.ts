import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { Document, ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const GetWatchListInsightsService = async (
  listId: string,
  authToken?: string
) => {
  try {
    let firebaseUser: DecodedIdToken | undefined;

    const watchListDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.watchlists);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
    }

    const _id = new ObjectId(listId);

    const pipeline: Document[] = [
      {
        $match: {
          _id,
        },
      },
      {
        $unwind: {
          path: "$movies",
          includeArrayIndex: "movieIndex",
        },
      },
      {
        $lookup: {
          from: "movies",
          let: {
            tmdbID: "$movies.tmdbID",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$id", "$$tmdbID"],
                },
              },
            },
          ],
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $lookup: {
          from: "reviews",
          let: {
            movieId: "$movie.id",
            reviewUserId: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$tmdbID", "$$movieId"],
                    },
                    {
                      $eq: ["$userId", "$$reviewUserId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "movie.reviews",
        },
      },
      // ---  Changes start here ---
      {
        $group: {
          // Group by movie id to preserve reviews
          _id: "$movie.id",
          watchListId: {
            $first: "$_id",
          },
          tags: {
            $first: "$tags",
          },
          public: {
            $first: "$public",
          },
          description: {
            $first: "$description",
          },
          title: {
            $first: "$title",
          },
          createdAt: {
            $first: "$createdAt",
          },
          updatedAt: {
            $first: "$updatedAt",
          },
          movies: {
            $first: "$movies",
          },
          userId: {
            $first: "$userId",
          },
          movie: {
            $first: "$movie",
          },
          totalRevenue: {
            $first: "$movie.revenue",
          },
          // Keep the movie document
          totalBudget: {
            $first: "$movie.budget",
          },
          totalRuntime: {
            $first: "$movie.runtime",
          },
          reviews: {
            $push: "$movie.reviews",
          }, // Collect reviews for each movie
        },
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields:
          /**
           * newField: The new field name.
           * expression: The new field expression.
           */
          {
            averageAdvancedScore: {
              $avg: "$reviews.averagedAdvancedScore",
            },
          },
      },
      {
        $group: {
          _id: "$_id",
          watchListId: {
            $first: "$watchListId",
          },
          tags: {
            $first: "$tags",
          },
          public: {
            $first: "$public",
          },
          description: {
            $first: "$description",
          },
          title: {
            $first: "$title",
          },
          createdAt: {
            $first: "$createdAt",
          },
          updatedAt: {
            $first: "$updatedAt",
          },
          userId: {
            $first: "$userId",
          },
          movies: {
            $first: "$movies",
          },
          movie: {
            $first: "$movie",
          },
          totalRevenue: {
            $first: "$totalRevenue",
          },
          totalBudget: {
            $first: "$totalBudget",
          },
          totalRuntime: {
            $first: "$totalRuntime",
          },
          averageAdvancedScore: {
            $avg: "$averageAdvancedScore",
          },
          reviews: {
            $push: "$reviews",
          }, // Push the reviews back into an array
        },
      },
      {
        $group: {
          // Group again to get the final structure
          _id: "$watchListId",
          tags: {
            $first: "$tags",
          },
          public: {
            $first: "$public",
          },
          description: {
            $first: "$description",
          },
          title: {
            $first: "$title",
          },
          createdAt: {
            $first: "$createdAt",
          },
          updatedAt: {
            $first: "$updatedAt",
          },
          userId: {
            $first: "$userId",
          },
          totalBudget: {
            $sum: "$totalBudget",
          },
          totalRuntime: {
            $sum: "$totalRuntime",
          },
          totalRevenue: {
            $sum: "$totalRevenue",
          },
          averageAdvancedScore: {
            $avg: "$averageAdvancedScore",
          },
          movies: {
            $push: {
              $mergeObjects: [
                "$movie",
                {
                  reviews: {
                    $first: "$reviews",
                  },
                  order: "$movies.order",
                }, // Add reviews back to the movie
              ],
            },
          },
        },
      },
      {
        $set: {
          movies: {
            $sortArray: {
              input: "$movies",
              sortBy: {
                order: 1,
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "uuid",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
          public: 1,
          description: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          userId: 1,
          movies: {
            title: 1,
            id: 1,
            budget: 1,
            runtime: 1,
            revenue: 1,
            reviews: 1,
            order: 1,
            poster_path: 1,
            backdrop_path: 1,
          },
          user: {
            username: "$user.username",
            photoUrl: "$user.photoUrl",
            uuid: "$user.uuid",
          },
          totalBudget: 1,
          totalRuntime: 1,
          totalRevenue: 1,
          averageAdvancedScore: {
            $round: ["$averageAdvancedScore", 2],
          },
        },
      },
    ];

    if (!firebaseUser) {
      pipeline.push({
        $match: {
          public: true,
        },
      });
    }

    const result = await watchListDB.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return {
        success: false,
        body: "Watchlist not found",
      };
    }

    const totalMovies = result[0]?.movies.length || 0;
    const reviewedMovies =
      result[0]?.movies.filter((movie: any) => movie.reviews.length > 0)
        .length || 0;
    const completionPercentage =
      totalMovies > 0 ? (reviewedMovies / totalMovies) * 100 : 0;

    result[0].completionPercentage = Math.floor(completionPercentage);

    return {
      success: true,
      body: result[0],
    };
  } catch (error) {
    console.error("GetWatchListInsightsService", error);
    return {
      success: false,
      body: error,
    };
  }
};

export default GetWatchListInsightsService;
