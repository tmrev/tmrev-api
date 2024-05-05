import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import {
  createNotification,
  NotificationTypes,
} from "../../../functions/notifications";

const followUserV2Service = async (followUid: string, authToken: string) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const authUser = await db.findOne({ uuid: firebaseUser.uid });
    const followUser = await db.findOne({ uuid: followUid });

    if (!authUser || !followUser) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    if (authUser.uuid === followUser.uuid) {
      return {
        success: false,
        error: "cannot follow yourself",
      };
    }

    const isFollowing = authUser.following.some((followingUser: ObjectId) =>
      followingUser.equals(followUser._id)
    );

    if (isFollowing) {
      return {
        success: false,
        error: "already following user",
      };
    }

    await db.updateOne(
      { uuid: authUser.uuid },
      { $push: { following: new ObjectId(followUser._id) } }
    );

    await db.updateOne(
      { uuid: followUser.uuid },
      { $push: { followers: new ObjectId(authUser._id) } }
    );

    await createNotification({
      sender: authUser._id.toString(),
      recipient: followUser._id.toString(),
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

export default followUserV2Service;
