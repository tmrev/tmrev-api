import _ from "lodash";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import getDetails from "../../endpoints/tmdb/getDetails";

const updateMovies = async (tmdbID: number | string) => {
  try {
    const dbMovies = client.db(tmrev.db).collection(tmrev.collection.movies);

    const dbMovieResult = await dbMovies.findOne({ tmdbID: Number(tmdbID) });

    // if dbMovieResult updatedAt is within 3 days, skip
    if (dbMovieResult && dbMovieResult.updatedAt) {
      const updatedAt = new Date(dbMovieResult.updatedAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      if (updatedAt > threeDaysAgo) {
        return;
      }
    }

    const freshMovieResult = await getDetails(Number(tmdbID), true);

    const isEqual = _.isEqual(dbMovieResult, freshMovieResult);

    if (!isEqual) {
      await dbMovies.updateOne(
        { id: Number(tmdbID) },
        {
          $set: {
            ...freshMovieResult,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
      console.log(`Updated movie: ${tmdbID}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export default updateMovies;
