import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const isUserService = async (uid: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const result = await db.findOne({ uuid: uid });

    if (result) {
      return true;
    }
    return false;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default isUserService;
