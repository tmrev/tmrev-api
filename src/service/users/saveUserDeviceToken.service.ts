// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";

import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const saveUserDeviceTokenService = async (
  authToken: string,
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

    if (user.devices && (user.devices as string[]).includes(deviceToken)) {
      return {
        success: false,
        error: "device token already exist",
      };
    }

    await db.updateOne(
      { uuid: user.uuid },
      { $push: { devices: { $each: [deviceToken] } } },
      { upsert: true }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export default saveUserDeviceTokenService;
