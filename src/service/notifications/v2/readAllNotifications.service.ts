import { getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const readAllNotifications = async (authToken: string) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);
    const dbNotifications = client
      .db(tmrev.db)
      .collection(tmrev.collection.notifications);

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
        error: "User not found",
      };
    }

    await dbNotifications.updateMany(
      { recipient: user.uuid },
      { $set: { isRead: true } }
    );

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

export default readAllNotifications;
