import getDetails from "../../endpoints/tmdb/getDetails";
import { appCache } from "../..";
import getImdbMovie from "../imdb/getMedia.service";
import getWatchProviders from "../../endpoints/tmdb/getWatchProviders";

const getMovie = async (movieId: number) => {
  try {
    console.log(appCache.get(movieId));

    if (appCache.has(movieId)) {
      return appCache.get(movieId);
    }

    const tmdbMovie = await getDetails(movieId);

    if (!tmdbMovie) throw new Error("Movie not found");

    const imdbMovie = await getImdbMovie(tmdbMovie.imdb_id);
    const watchProvider = await getWatchProviders(tmdbMovie.id);

    const body = {
      ...tmdbMovie,
      watchProvider: watchProvider?.results,
      imdb: imdbMovie,
    };

    appCache.set(movieId, {
      success: true,
      body,
    });

    return {
      success: true,
      body,
    };
  } catch (error: any) {
    return {
      success: false,
      error,
    };
  }
};

export default getMovie;
