import getDetails from "../../endpoints/tmdb/getDetails";
import { Movie } from "../../models/tmdb";

type BatchMovie = { [x: string]: Movie };

const batchMovie = async (movieId: number[]) => {
  try {
    const tmdbMoviePromise = movieId.map((id) => getDetails(id, false));

    const results = await Promise.all(tmdbMoviePromise);

    const data: BatchMovie = {};

    results.forEach((value) => {
      if (value) {
        data[value.id] = value;
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

export default batchMovie;
