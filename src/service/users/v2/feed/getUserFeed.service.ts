import { getAuth } from "firebase-admin/auth";
import { Document } from "mongodb";
import { client } from "../../../..";
import { tmrev } from "../../../../models/mongodb";

export type UserFeedQueryType = {
  pageNumber: number;
  pageSize: number;
};

const getUserFeed = async (authToken: string, query: UserFeedQueryType) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);
    const feedDB = client.db(tmrev.db).collection(tmrev.collection.feed);

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const pipeline: Document[] = [
      {
        $match: {
          userId: user._id,
          "reviews.seen": false,
        },
      },
      {
        $project: {
          _id: 1,
          reviews: 1,
          userId: 1,
        },
      },
      {
        $unwind: {
          path: "$reviews",
        },
      },
      {
        $skip: query.pageNumber * query.pageSize,
      },
      {
        $limit: query.pageSize,
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews.reviewData",
          foreignField: "_id",
          as: "reviewDetails",
        },
      },
      {
        $project: {
          _id: 1,
          reviews: {
            _id: {
              $first: "$reviewDetails._id",
            },
            userId: {
              $first: "$reviewDetails.userId",
            },
            averagedAdvancedScore: {
              $first: "$reviewDetails.averagedAdvancedScore",
            },
            notes: {
              $first: "$reviewDetails.notes",
            },
            tmdbID: {
              $first: "$reviewDetails.tmdbID",
            },
            advancedScore: {
              $first: "$reviewDetails.advancedScore",
            },
            public: {
              $first: "$reviewDetails.public",
            },
            title: {
              $first: "$reviewDetails.title",
            },
            createdAt: {
              $first: "$reviewDetails.createdAt",
            },
            updatedAt: {
              $first: "$reviewDetails.updatedAt",
            },
            reviewedDate: {
              $first: "$reviewDetails.reviewedDate",
            },
            votes: {
              $first: "$reviewDetails.votes",
            },
            seen: "$reviews.seen",
          },
        },
      },
      {
        $match: {
          "reviews.public": true,
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "reviews.tmdbID",
          foreignField: "id",
          as: "reviews.movieDetails",
        },
      },
      {
        $unwind: {
          path: "$reviews.movieDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reviews.userId",
          foreignField: "uuid",
          as: "reviews.user",
        },
      },
      {
        $lookup: {
          from: tmrev.collection.comments,
          localField: "reviews._id",
          foreignField: "post.id",
          as: "reviews.replies",
        },
      },
      {
        $addFields: {
          "reviews.replies": { $size: "$reviews.replies" },
        },
      },
      {
        $project: {
          _id: 1,
          reviews: {
            _id: 1,
            userId: 1,
            averagedAdvancedScore: 1,
            notes: 1,
            tmdbID: 1,
            advancedScore: 1,
            public: 1,
            title: 1,
            createdAt: 1,
            updatedAt: 1,
            reviewedDate: 1,
            votes: 1,
            seen: 1,
            replies: 1,
            userDetails: {
              _id: {
                $first: "$reviews.user._id",
              },
              username: {
                $first: "$reviews.user.username",
              },
              photoUrl: {
                $first: "$reviews.user.photoUrl",
              },
              uuid: {
                $first: "$reviews.user.uuid",
              },
            },
            movieDetails: {
              id: 1,
              backdrop_path: 1,
              budget: 1,
              poster_path: 1,
              popularity: 1,
              title: 1,
              overview: 1,
              revenue: 1,
              runtime: 1,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          reviews: {
            $push: "$reviews",
          },
        },
      },
      {
        $sort: {
          "reviews.updatedAt": -1,
        },
      },
    ];

    const countPipeline = [
      {
        $match: {
          userId: user._id,
          "reviews.seen": false,
        },
      },
      {
        $project: {
          _id: 1,
          reviews: 1,
          userId: 1,
        },
      },
      {
        $unwind: {
          path: "$reviews",
        },
      },
      {
        $count: "totalCount",
      },
    ];

    const feed = await feedDB.aggregate(pipeline).toArray();
    const countResult = await feedDB.aggregate(countPipeline).toArray();

    const totalCount = countResult[0]?.totalCount || 0;

    const totalNumberOfPages = Math.floor(totalCount / query.pageSize);

    return {
      success: true,
      body: {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        totalNumberOfPages,
        totalCount,
        feed: feed[0] || [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getUserFeed;
