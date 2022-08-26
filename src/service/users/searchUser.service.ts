import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const searchUserService = async (q: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const result = await db.find({ $text: { $search: q } }).toArray();

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default searchUserService;
