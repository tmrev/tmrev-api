// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";

import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { PostTypes, Vote } from "../../../models/tmdb/comments";
import {
  NotificationTypes,
  createNotificationV2,
} from "../../../functions/notifications";

export const hasUserVoted = (userId: string, votes: Vote) => {
  const upVoteMatch = votes.upVote.filter((vote) => vote === userId);
  const downVoteMatch = votes.downVote.filter((vote) => vote === userId);

  if (upVoteMatch.length) {
    return {
      type: NotificationTypes.UP_VOTE,
      index: votes.upVote.findIndex((vote) => vote === userId),
    };
  }

  if (downVoteMatch.length) {
    return {
      type: NotificationTypes.DOWN_VOTE,
      index: votes.downVote.findIndex((vote) => vote === userId),
    };
  }

  return undefined;
};

const voteReviewService = async (
  authToken: string,
  reviewId: string,
  vote: boolean
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const userDb = client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await userDb.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const currentMovie = await db.findOne({
      _id: new ObjectId(reviewId),
    });

    if (!currentMovie) {
      return {
        success: false,
        error: "Movie Review not found",
      };
    }

    const currentMovieAuthor = await userDb.findOne({
      uuid: currentMovie.userId,
    });

    if (!currentMovieAuthor) {
      return {
        success: false,
        error: "Movie Review author not found",
      };
    }

    const voted = hasUserVoted(user.uuid, currentMovie.votes);

    if (voted && voted.type === NotificationTypes.UP_VOTE) {
      currentMovie.votes.upVote.splice(voted.index, 1);
    } else if (voted && voted.type === NotificationTypes.DOWN_VOTE) {
      (currentMovie.votes.downVote as any[]).splice(voted.index, 1);
    }

    if (vote && voted?.type !== NotificationTypes.UP_VOTE) {
      currentMovie.votes.upVote.push(user.uuid);
    } else if (!vote && voted?.type !== NotificationTypes.DOWN_VOTE) {
      currentMovie.votes.downVote.push(user.uuid);
    }

    await db.updateOne({ _id: new ObjectId(reviewId) }, { $set: currentMovie });

    const notificationDB = await client
      .db(tmrev.db)
      .collection(tmrev.collection.notifications);

    const doesNotificationExist = await notificationDB.findOne({
      recipient: currentMovie.userId,
      sender: user.uuid,
      contentType: PostTypes.REVIEWS,
      contentId: new ObjectId(reviewId),
    });

    if (
      vote &&
      voted?.type !== NotificationTypes.UP_VOTE &&
      user.uuid !== currentMovie.userId
    ) {
      if (!doesNotificationExist) {
        await createNotificationV2(
          {
            contentId: new ObjectId(reviewId),
            contentType: PostTypes.REVIEWS,
            notificationContent: {
              body: "liked your review",
              title: "New Like",
            },
            notificationType: "like",
            recipient: currentMovie.userId,
            sender: user.uuid,
          },
          currentMovieAuthor.devices,
          `/(tabs)/(home)/home/${reviewId}?contentType=${PostTypes.REVIEWS}&from=home`,
          `${user.firstName} liked your review`
        );
      } else {
        await notificationDB.updateOne(
          {
            recipient: currentMovie.userId,
            sender: user.uuid,
            contentType: PostTypes.REVIEWS,
            contentId: new ObjectId(reviewId),
          },
          {
            $set: {
              notificationContent: {
                body: "Liked your review",
                title: "New Like",
              },
              notificationType: "like",
              isRead: false,
            },
          }
        );
      }
    } else if (
      !vote &&
      voted?.type !== NotificationTypes.DOWN_VOTE &&
      user.uuid !== currentMovie.userId
    ) {
      if (!doesNotificationExist) {
        await createNotificationV2(
          {
            contentId: new ObjectId(reviewId),
            contentType: PostTypes.REVIEWS,
            notificationContent: {
              body: "Disliked your review",
              title: "New Dislike",
            },
            notificationType: "dislike",
            recipient: currentMovie.userId,
            sender: user.uuid,
          },
          currentMovieAuthor.devices,
          `/(tabs)/(home)/home/${reviewId}?contentType=${PostTypes.REVIEWS}&from=home`,
          `${user.firstName} disliked your review`
        );
      } else {
        await notificationDB.updateOne(
          {
            recipient: currentMovie.userId,
            sender: user.uuid,
            contentType: PostTypes.REVIEWS,
            contentId: new ObjectId(reviewId),
          },
          {
            $set: {
              notificationContent: {
                body: "disliked your comment",
                title: "New Dislike",
              },
              notificationType: "dislike",
              isRead: false,
            },
          }
        );
      }
    } else if (doesNotificationExist) {
      await notificationDB.deleteOne({
        recipient: currentMovie.userId,
        sender: user.uuid,
        contentType: PostTypes.REVIEWS,
        contentId: new ObjectId(reviewId),
      });
    }

    const result = await db.findOne({
      _id: new ObjectId(reviewId),
    });

    return {
      success: true,
      body: result,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: err,
    };
  }
};

export default voteReviewService;
