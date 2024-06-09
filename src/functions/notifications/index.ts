/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import { PostTypes } from "../../models/tmdb/comments";
import sendNotification from "./sendNotification";

export enum NotificationTypes {
  COMMENT = "comments",
  DOWN_VOTE = "downVote",
  FOLLOW = "follow",
  REPLY = "reply",
  UN_FOLLOW = "unfollow",
  UP_VOTE = "upVote",
}

export interface CreateNotification {
  recipient: string;
  reply?: {
    id: string;
    message: string;
  };
  reviewId?: string;
  sender: string;
  type: NotificationTypes;
}

export type NotificationType = "like" | "dislike" | "comment" | "viewed";
type NotificationContent = {
  body: string;
  title: string;
};

type ContentType = PostTypes.COMMENTS | PostTypes.REVIEWS | PostTypes.LISTS;

type NotificationV2 = {
  contentId: ObjectId;
  contentType: ContentType;
  createdAt: Date;
  isRead: boolean;
  notificationContent: NotificationContent;
  notificationType: NotificationType;
  recipient: string;
  sender: string;
};

type CreateNotificationV2 = {
  contentId: ObjectId;
  contentType: ContentType;
  notificationContent: NotificationContent;
  notificationType: NotificationType;
  recipient: string;
  sender: string;
};

const createNotification = async (payload: CreateNotification) => {
  const notificationsDB = await client
    .db(tmrev.db)
    .collection(tmrev.collection.notifications);

  if (
    payload.type === NotificationTypes.FOLLOW ||
    payload.type === NotificationTypes.UN_FOLLOW
  ) {
    await notificationsDB.insertOne({
      recipient: new ObjectId(payload.recipient),
      type: payload.type,
      sender: new ObjectId(payload.sender),
      read: false,
    });
  } else if (payload.type === NotificationTypes.REPLY && payload.reply) {
    await notificationsDB.insertOne({
      recipient: new ObjectId(payload.recipient),
      reviewId: new ObjectId(payload.reviewId),
      type: payload.type,
      sender: new ObjectId(payload.sender),
      message: payload.reply.message,
      replyId: new ObjectId(payload.reply.id),
      read: false,
    });
  } else if (payload.reviewId) {
    await notificationsDB.insertOne({
      recipient: new ObjectId(payload.recipient),
      reviewId: new ObjectId(payload.reviewId),
      type: payload.type,
      sender: new ObjectId(payload.sender),
      read: false,
    });
  }
};

const createNotificationV2 = async (
  payload: CreateNotificationV2,
  deviceTokens?: string[],
  linkUrl?: string,
  notificationTitle?: string
) => {
  console.log(payload, deviceTokens, linkUrl, notificationTitle);
  const notificationsDB = await client
    .db(tmrev.db)
    .collection(tmrev.collection.notifications);

  const dbInsert: NotificationV2 = {
    ...payload,
    createdAt: new Date(),
    isRead: false,
  };

  if (deviceTokens && linkUrl) {
    try {
      const notification = {
        title: payload.notificationContent.title,
        body: payload.notificationContent.body,
      };
      sendNotification(
        deviceTokens,
        notificationTitle || notification.title,
        notification.body,
        linkUrl
      ).then((response) => console.dir(response, { depth: 9 }));
    } catch (error) {
      console.error(error);
    }
  }

  await notificationsDB.insertOne(dbInsert);
};

const readNotification = async (notificationId: ObjectId) => {
  const notificationsDB = await client
    .db(tmrev.db)
    .collection(tmrev.collection.notifications);

  await notificationsDB.updateOne(
    {
      _id: notificationId,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );
};

const forgetNotification = async (notificationId: ObjectId) => {
  const notificationsDB = await client
    .db(tmrev.db)
    .collection(tmrev.collection.notifications);

  await notificationsDB.updateOne(
    {
      _id: notificationId,
    },
    {
      $set: {
        isRead: false,
      },
    }
  );
};

const retrieveNotification = async (userId: ObjectId, read = false) => {
  const notificationsDB = await client
    .db(tmrev.db)
    .collection(tmrev.collection.notifications);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const id = new ObjectId(
    `${Math.floor(thirtyDaysAgo.getTime() / 1000).toString(16)}0000000000000000`
  );

  const pipeline = [
    {
      $match: {
        recipient: userId,
        read,
        _id: { $gte: id },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "recipient",
        foreignField: "_id",
        as: "recipient",
      },
    },
    {
      $unwind: {
        path: "$recipient",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
      },
    },
    {
      $unwind: {
        path: "$sender",
      },
    },
    {
      $addFields: {
        reviewId: {
          $cond: [{ $ifNull: ["$reviewId", false] }, "$reviewId", null],
        },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviewId",
        foreignField: "_id",
        as: "review",
      },
    },
    {
      $unwind: {
        path: "$review",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        review: {
          $cond: [{ $ne: ["$reviewId", null] }, "$review", "$$REMOVE"],
        },
      },
    },
    {
      $sort: {
        createdAt: -1, // sort by newest first
      },
    },
  ];

  const results = await notificationsDB.aggregate(pipeline).toArray();

  return results;
};

export {
  createNotification,
  createNotificationV2,
  readNotification,
  forgetNotification,
  retrieveNotification,
};
