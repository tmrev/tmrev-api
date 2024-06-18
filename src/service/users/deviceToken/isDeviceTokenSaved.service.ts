import { getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const isDeviceTokenSavedService = async (
  authToken: string,
  deviceToken: string
) => {
  try {
    console.log(authToken, deviceToken);
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    if (!firebaseUser) return { success: false, error: "User not found" };

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    if (!user.devices) return { success: false, error: "No devices found" };

    const saved = user.devices.includes(deviceToken);

    return {
      success: true,
      saved,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export default isDeviceTokenSavedService;
