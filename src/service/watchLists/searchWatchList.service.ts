import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const searchWatchListService = async (q: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const result = await db
      .find({ $text: { $search: q }, $and: [{ public: true }] })
      .toArray();

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default searchWatchListService;
