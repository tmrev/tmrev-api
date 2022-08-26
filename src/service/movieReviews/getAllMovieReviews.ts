import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getAllMovieReviewsService = async (tmdbID: string) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const result = await db
      .find({ tmdbID: Number(tmdbID), public: true })
      .toArray();

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getAllMovieReviewsService;
