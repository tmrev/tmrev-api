// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import {
  NotificationTypes,
  createNotification,
} from "../../functions/notifications";

const followUserService = async (authToken: string, userId: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);
    let result = {};

    const userDoc = await db.findOne({ uuid: user.uid });

    const followerUser = await db.findOne({ uuid: userId });

    if (userDoc && followerUser) {
      if (userDoc.following && userDoc.following.includes(userId)) {
        await db.updateOne(
          { uuid: user.uid },
          { $pull: { following: userId } }
        );
        result = "unfollowed";

        await createNotification({
          sender: userDoc._id.toString(),
          recipient: followerUser._id.toString(),
          type: NotificationTypes.UN_FOLLOW,
        });
      } else {
        await db.updateOne(
          { uuid: user.uid },
          { $addToSet: { following: userId } }
        );
        result = "followed";

        await createNotification({
          sender: userDoc._id.toString(),
          recipient: followerUser._id.toString(),
          type: NotificationTypes.FOLLOW,
        });
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default followUserService;
