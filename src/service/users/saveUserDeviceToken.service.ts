// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";

import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const saveUserDeviceTokenService = async (
  authToken: string,
  userId: string,
  deviceToken: string
) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await db.findOne({ uuid: firebaseUser.uid });

    if (!user)
      return {
        success: false,
        error: "Unable to find user",
      };

    if ((user.devices as string[]).includes(deviceToken)) {
      return {
        success: false,
        error: "device token already exist",
      };
    }

    await db.updateOne(
      { uuid: userId },
      { $push: { devices: { $each: [deviceToken] } } }
    );

    return "success";
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default saveUserDeviceTokenService;
