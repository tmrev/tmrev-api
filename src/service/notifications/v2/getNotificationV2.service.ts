import { getAuth } from "firebase-admin/auth";
import { Document } from "mongodb";
import { ContentType } from "../../../models/generalTypes";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { PostTypes } from "../../../models/tmdb/comments";

const getNotificationV2Service = async (
  authToken: string,
  contentType: ContentType
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    const pipeline: Document[] = [];

    if (!firebaseUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const notificationsDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.notifications);

    if (contentType === PostTypes.COMMENTS) {
      pipeline.push(
        ...[
          {
            $match: {
              recipient: user.uuid,
              contentType: "comments",
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "contentId",
              foreignField: "_id",
              as: "content",
            },
          },
          {
            $unwind: {
              path: "$content",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "uuid",
              as: "sender",
            },
          },
          {
            $unwind: {
              path: "$sender",
            },
          },
          {
            $project: {
              _id: 1,
              contentId: 1,
              contentType: 1,
              createAt: 1,
              notificationContent: 1,
              notificationType: 1,
              recipient: 1,
              sender: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                uuid: 1,
                photoUrl: 1,
              },
              createdAt: 1,
              isRead: 1,
              content: 1,
            },
          },
        ]
      );
    }

    if (contentType === PostTypes.REVIEWS) {
      pipeline.push(
        ...[
          {
            $match: {
              recipient: user.uuid,
              contentType: "reviews",
            },
          },
          {
            $lookup: {
              from: "reviews",
              localField: "contentId",
              foreignField: "_id",
              as: "content",
            },
          },
          {
            $unwind: {
              path: "$content",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "uuid",
              as: "sender",
            },
          },
          {
            $unwind: {
              path: "$sender",
            },
          },
          {
            $lookup: {
              from: "movies",
              localField: "content.tmdbID",
              foreignField: "id",
              as: "content.movieDetails",
            },
          },
          {
            $unwind: {
              path: "$content.movieDetails",
            },
          },
          {
            $project: {
              _id: 1,
              contentId: 1,
              contentType: 1,
              notificationContent: 1,
              notificationType: 1,
              recipient: 1,
              createdAt: 1,
              sender: {
                _id: 1,
                firstName: 1,
                lastName: 11,
                uuid: 1,
                photoUrl: 1,
              },
              isRead: 1,
              content: {
                _id: 1,
                userId: 1,
                averagedAdvancedScore: 1,
                notes: 1,
                tmdbID: 1,
                advacnedScore: 1,
                title: 1,
                movieDetails: {
                  title: 1,
                  poster_path: 1,
                  id: 1,
                  genres: 1,
                },
              },
            },
          },
        ]
      );
    }

    const result = await notificationsDB.aggregate(pipeline).toArray();

    return {
      success: true,
      body: result,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error,
    };
  }
};

export default getNotificationV2Service;
