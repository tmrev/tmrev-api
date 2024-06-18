import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import isUsernameAvailableService from "./isUsernameAvailable.service";

const deleteUserService = async (authToken: string) => {
  try {
    let count = 1;
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    if (!firebaseUser) return { success: false, error: "User not found" };

    const user = userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const newUsername = async (): Promise<string> => {
      const result = await isUsernameAvailableService(`deleted-${count}`);
      if (result.isAvailable) {
        return `deleted-${count}`;
      }
      count += 1;
      return newUsername();
    };

    const username = await newUsername();

    await userDB.updateOne(
      { uuid: firebaseUser.uid },
      {
        $set: {
          username,
          email: `${username}`,
          public: false,
          photoUrl: `https://api.dicebear.com/8.x/thumbs/png?seed=${username}`,
          pinned: [],
          followers: [],
          following: [],
          updatedAt: new Date(),
          link: null,
        },
      }
    );

    await getAuth().deleteUser(firebaseUser.uid);

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

export default deleteUserService;
