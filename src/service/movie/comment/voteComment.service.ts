import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { hasUserVoted } from "../review/voteReview.service";
import {
  createNotificationV2,
  NotificationTypes,
} from "../../../functions/notifications";
import { PostTypes } from "../../../models/tmdb/comments";

const voteCommentService = async (
  authToken: string,
  commendId: string,
  vote: boolean
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.comments);
    const userDb = client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await userDb.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const currentComment = await db.findOne({
      _id: new ObjectId(commendId),
    });

    if (!currentComment) {
      return {
        success: false,
        error: "Comment not found",
      };
    }

    const currentCommentAuthor = await userDb.findOne({
      uuid: currentComment.author,
    });

    if (!currentCommentAuthor) {
      return {
        success: false,
        error: "Comment author not found",
      };
    }

    const voted = hasUserVoted(user.uuid, currentComment.votes);

    if (voted && voted?.type === NotificationTypes.UP_VOTE) {
      currentComment.votes.upVote.splice(voted.index, 1);
    } else if (voted && voted?.type === NotificationTypes.DOWN_VOTE) {
      currentComment.votes.downVote.splice(voted.index, 1);
    }

    if (vote && voted?.type !== NotificationTypes.UP_VOTE) {
      currentComment.votes.upVote.push(user.uuid);
    } else if (!vote && voted?.type !== NotificationTypes.DOWN_VOTE) {
      currentComment.votes.downVote.push(user.uuid);
    }

    await db.updateOne(
      { _id: new ObjectId(commendId) },
      {
        $set: {
          votes: currentComment.votes,
        },
      }
    );

    const notificationDB = await client
      .db(tmrev.db)
      .collection(tmrev.collection.notifications);

    const doesNotificationExist = await notificationDB.findOne({
      recipient: currentComment.author,
      sender: user.uuid,
      contentType: PostTypes.COMMENTS,
      contentId: new ObjectId(commendId),
    });

    if (
      vote &&
      voted?.type !== NotificationTypes.UP_VOTE &&
      user.uuid !== currentComment.author
    ) {
      if (!doesNotificationExist) {
        await createNotificationV2(
          {
            contentId: new ObjectId(commendId),
            contentType: PostTypes.COMMENTS,
            notificationContent: {
              body: "liked your comment",
              title: "New Like",
            },
            notificationType: "like",
            recipient: currentComment.author,
            sender: user.uuid,
          },
          currentCommentAuthor.devices,
          `/(tabs)/(home)/home/${commendId}?contentType=${PostTypes.COMMENTS}&from=home`,
          `${user.firstName} liked your comment`
        );
      } else {
        await notificationDB.updateOne(
          {
            recipient: currentComment.author,
            sender: user.uuid,
            contentType: PostTypes.COMMENTS,
            contentId: new ObjectId(commendId),
          },
          {
            $set: {
              notificationContent: {
                body: "liked your comment",
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
      user.uuid !== currentComment.author
    ) {
      if (!doesNotificationExist) {
        await createNotificationV2(
          {
            contentId: new ObjectId(commendId),
            contentType: PostTypes.COMMENTS,
            notificationContent: {
              body: "disliked your comment",
              title: "New Dislike",
            },
            notificationType: "dislike",
            recipient: currentComment.author,
            sender: user.uuid,
          },
          currentCommentAuthor.devices,
          `/(tabs)/(home)/home/${commendId}?contentType=${PostTypes.COMMENTS}&from=home`,
          `${user.firstName} disliked your comment`
        );
      } else {
        await notificationDB.updateOne(
          {
            recipient: currentComment.author,
            sender: user.uuid,
            contentType: PostTypes.COMMENTS,
            contentId: new ObjectId(commendId),
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
        recipient: currentComment.author,
        sender: user.uuid,
        contentType: PostTypes.COMMENTS,
        contentId: new ObjectId(commendId),
      });
    }

    const result = await db.findOne({
      _id: new ObjectId(commendId),
    });

    return {
      success: true,
      body: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default voteCommentService;
