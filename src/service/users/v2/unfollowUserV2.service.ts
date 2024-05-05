import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import {
  createNotification,
  NotificationTypes,
} from "../../../functions/notifications";

const unfollowUserV2Service = async (
  unfollowUid: string,
  authToken: string
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const authUser = await db.findOne({ uuid: firebaseUser.uid });
    const unfollowUser = await db.findOne({ uuid: unfollowUid });

    if (!authUser || !unfollowUser) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    if (authUser.uuid === unfollowUser.uuid) {
      return {
        success: false,
        error: "cannot unfollow yourself",
      };
    }

    const isFollowing = authUser.following.some((unfollowingUser: ObjectId) =>
      unfollowingUser.equals(unfollowUser._id)
    );

    if (!isFollowing) {
      return {
        success: false,
        error: "not following user",
      };
    }

    await db.updateOne(
      { uuid: authUser.uuid },
      { $pull: { following: unfollowUser._id } }
    );
    await db.updateOne(
      { uuid: unfollowUser.uuid },
      { $pull: { followers: authUser._id } }
    );

    await createNotification({
      sender: authUser._id.toString(),
      recipient: unfollowUser._id.toString(),
      type: NotificationTypes.FOLLOW,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default unfollowUserV2Service;
