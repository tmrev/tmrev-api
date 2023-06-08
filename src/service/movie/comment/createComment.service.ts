// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { PostTypes, Comment } from "../../../models/tmdb/comments";
import { tmrev } from "../../../models/mongodb";
import { timestamp } from "../../../utils/common";
import {
  NotificationTypes,
  createNotification,
} from "../../../functions/notifications";

const createCommentService = async (
  reviewId: string,
  comment: string,
  authToken: string
) => {
  try {
    const dbReviews = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const dbComments = client
      .db(tmrev.db)
      .collection(tmrev.collection.comments);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const user = await dbUsers.findOne({ uuid: firebaseUser.uid });
    const review = await dbReviews.findOne({ _id: new ObjectId(reviewId) });

    if (!review || !user) throw new Error("Unable to find review");

    const payload: Comment = {
      author: new ObjectId(user._id),
      comment,
      createdAt: timestamp(),
      updatedAt: null,
      post: {
        author: new ObjectId(review.user),
        id: new ObjectId(review._id),
        type: PostTypes.REVIEWS,
      },
      votes: {
        upVote: [],
        downVote: [],
      },
    };

    const { insertedId } = await dbComments.insertOne(payload);

    await createNotification({
      recipient: review.user,
      sender: user._id.toString(),
      reviewId: review._id.toString(),
      reply: {
        id: insertedId.toString(),
        message: comment,
      },
      type: NotificationTypes.REPLY,
    });

    const result = await dbComments.findOne({ _id: insertedId });

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

export default createCommentService;
