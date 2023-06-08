// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { retrieveNotification } from "../../functions/notifications";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const retrieveNotificationService = async (
  authToken: string,
  read?: boolean
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const userDB = await client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const notifications = await retrieveNotification(user._id, read);

    return {
      success: true,
      body: notifications,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default retrieveNotificationService;
