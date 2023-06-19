// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
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

    const _id = new ObjectId(userId);

    const userDoc = await db.findOne({ uuid: user.uid });

    const followerUser = await db.findOne({ _id });

    const flatFollowers = userDoc?.following.map((s: ObjectId) => s.toString());

    if (userDoc && followerUser) {
      if (userDoc.following && flatFollowers.includes(_id.toString())) {
        // current user
        await db.updateOne({ _id: userDoc._id }, { $pull: { following: _id } });

        // user that will be unfollowed
        await db.updateOne(
          {
            _id,
          },
          { $pull: { followers: _id } }
        );
        result = "unfollowed";

        await createNotification({
          sender: userDoc._id.toString(),
          recipient: followerUser._id.toString(),
          type: NotificationTypes.UN_FOLLOW,
        });
      } else {
        // current user
        await db.updateOne(
          { _id: userDoc._id },
          { $addToSet: { following: _id } }
        );

        // user that will be followed
        await db.updateOne({ _id }, { $addToSet: { followers: _id } });
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
