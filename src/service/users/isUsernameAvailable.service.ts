import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const isUsernameAvailableService = async (username: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const normalizedUsername = username.toLowerCase();
    const dbUser = await db.findOne({
      username: normalizedUsername,
    });

    if (dbUser) {
      return {
        success: true,
        isAvailable: false,
      };
    }

    return {
      success: true,
      isAvailable: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default isUsernameAvailableService;
