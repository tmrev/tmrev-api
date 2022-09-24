import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getWatchedService = async (userId: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.watched);

    const result = await db.find({ userId }).toArray();

    return {
      success: true,
      body: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getWatchedService;
