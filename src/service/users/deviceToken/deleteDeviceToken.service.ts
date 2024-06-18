import { getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const deleteDeviceTokenService = async (
  authToken: string,
  deviceToken: string
) => {
  try {
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

    await userDB.updateOne(
      { uuid: firebaseUser.uid },
      {
        $pull: {
          devices: deviceToken,
        },
      }
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

export default deleteDeviceTokenService;
