// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { PostTypes, Comment } from "../../../models/tmdb/comments";
import { tmrev } from "../../../models/mongodb";
import { createNotificationV2 } from "../../../functions/notifications";
import { ContentType } from "../../../models/generalTypes";

const createCommentService = async (
  reviewId: string,
  comment: string,
  contentType: ContentType,
  authToken: string
) => {
  try {
    const dbReviews = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const dbComments = client
      .db(tmrev.db)
      .collection(tmrev.collection.comments);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    if (!firebaseUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const user = await dbUsers.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "Review or user not found",
      };
    }

    if (contentType === PostTypes.REVIEWS) {
      const review = await dbReviews.findOne({ _id: new ObjectId(reviewId) });

      if (!review) {
        return {
          success: false,
          error: "Review not found",
        };
      }

      const payload: Comment = {
        author: user.uuid,
        comment,
        createdAt: new Date(),
        updatedAt: new Date(),
        post: {
          author: review.userId,
          id: new ObjectId(review._id),
          type: PostTypes.REVIEWS,
        },
        votes: {
          upVote: [],
          downVote: [],
        },
      };

      const { insertedId } = await dbComments.insertOne(payload);

      const result = await dbComments.findOne({ _id: insertedId });

      const postAuthor = await dbUsers.findOne({ uuid: review.userId });

      if (postAuthor && postAuthor.uuid !== user.uuid) {
        await createNotificationV2(
          {
            contentId: review._id,
            contentType: PostTypes.REVIEWS,
            notificationContent: {
              body: comment,
              title: `commented on your review`,
            },
            notificationType: "comment",
            recipient: postAuthor.uuid,
            sender: user.uuid,
          },
          postAuthor.devices,
          `/(tabs)/(home)/home/${review._id}?contentType=${PostTypes.REVIEWS}&from=home`,
          `${user.username} commented on your review`
        );
      }
      return {
        success: true,
        body: result,
      };
    }

    if (contentType === PostTypes.COMMENTS) {
      const commentResult = await dbComments.findOne({
        _id: new ObjectId(reviewId),
      });

      if (!commentResult) {
        return {
          success: false,
          error: "Comment not found",
        };
      }

      const payload: Comment = {
        author: user.uuid,
        comment,
        createdAt: new Date(),
        updatedAt: new Date(),
        post: {
          author: commentResult.author,
          id: new ObjectId(commentResult._id),
          type: PostTypes.COMMENTS,
        },
        votes: {
          upVote: [],
          downVote: [],
        },
      };

      const { insertedId } = await dbComments.insertOne(payload);

      const result = await dbComments.findOne({ _id: insertedId });

      const postAuthor = await dbUsers.findOne({ uuid: commentResult.author });

      if (postAuthor && postAuthor.uuid !== user.uuid) {
        await createNotificationV2(
          {
            contentId: commentResult._id,
            contentType: PostTypes.COMMENTS,
            notificationContent: {
              body: comment,
              title: `replied to your comment`,
            },
            notificationType: "comment",
            recipient: postAuthor.uuid,
            sender: user.uuid,
          },
          postAuthor.devices,
          `/(tabs)/(home)/home/${commentResult._id}?contentType=${PostTypes.COMMENTS}&from=home`,
          `${user.username} replied to your comment`
        );
      }

      return {
        success: true,
        body: result,
      };
    }

    return {
      success: false,
      error: "Invalid content type",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
};

export default createCommentService;
