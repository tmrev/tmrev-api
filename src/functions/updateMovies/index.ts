import _ from "lodash";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import getDetails from "../../endpoints/tmdb/getDetails";
import getWatchProviders from "../../endpoints/tmdb/getWatchProviders";

const updateMovies = async (tmdbID: number | string) => {
  try {
    console.log(`Updating movie: ${tmdbID}`);
    const dbMovies = client.db(tmrev.db).collection(tmrev.collection.movies);

    const dbMovieResult = await dbMovies.findOne({ tmdbID: Number(tmdbID) });

    // if dbMovieResult updatedAt is within 3 days, skip
    if (dbMovieResult && dbMovieResult.updatedAt) {
      const updatedAt = new Date(dbMovieResult.updatedAt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      if (updatedAt > threeDaysAgo) return;
    }

    const freshMovieResult = await getDetails(Number(tmdbID), true);
    const freshMovieProviders = await getWatchProviders(Number(tmdbID));

    if (freshMovieResult) {
      freshMovieResult.watchProviders = freshMovieProviders?.results;
      console.log("adding watch providers", !!freshMovieProviders?.results);
    }

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
    } else {
      console.log(`Skipped movie: ${tmdbID}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export default updateMovies;
