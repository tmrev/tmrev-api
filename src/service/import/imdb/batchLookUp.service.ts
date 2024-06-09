import getFindExternal from "../../../endpoints/tmdb/getFindExternal";
import { Movie } from "../../../models/tmdb";

type BatchMovie = { [x: string]: Movie };

const batchLookUpService = async (movieId: string[]) => {
  try {
    const movie = movieId.map((id) => getFindExternal(id));

    const results = await Promise.all(movie);

    const data: BatchMovie = {};

    results.forEach((value, i) => {
      if (value && value.movie_results.length) {
        const movieResult = value.movie_results[0];
        data[movieId[i]] = movieResult;
      }
    });

    return {
      success: true,
      body: {
        ...data,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error,
    };
  }
};

export default batchLookUpService;
