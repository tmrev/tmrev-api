import _ from "lodash";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import getDetails from "../../endpoints/tmdb/getDetails";

const updateMovies = async (tmdbID: number | string) => {
  try {
    const dbMovies = client.db(tmrev.db).collection(tmrev.collection.movies);

    const freshMovieResult = await getDetails(Number(tmdbID), true);

    const dbMovieResult = await dbMovies.findOne({ tmdbID: Number(tmdbID) });

    const isEqual = _.isEqual(dbMovieResult, freshMovieResult);

    if (!isEqual) {
      await dbMovies.updateOne(
        { id: Number(tmdbID) },
        {
          $set: freshMovieResult,
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export default updateMovies;
