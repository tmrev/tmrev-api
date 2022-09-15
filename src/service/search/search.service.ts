import { client } from "../..";
import getSearchMovie from "../../endpoints/tmdb/getSearchMovie";
import { tmrev } from "../../models/mongodb";

const searchService = async (q: string) => {
  try {
    const watchListDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.watchlists);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    const userResult = await userDB.find({ $text: { $search: q } }).toArray();
    const watchListResult = await watchListDB
      .find({ $text: { $search: q }, $and: [{ public: true }] })
      .toArray();
    const tmdbResult = await getSearchMovie({ query: q, language: "en-US" });

    return {
      success: true,
      body: {
        watchList: watchListResult,
        tmdb: tmdbResult,
        user: userResult,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default searchService;
