// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import getDetails from "../../endpoints/tmdb/getDetails";
import { Movie } from "../../models/tmdb";

const getWatchListService = async (uuid: string, authToken?: string) => {
  try {
    const fetchResult = async () => {
      const id = new ObjectId(uuid);

      const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);
      const tmdbMoviesDb = client
        .db(tmrev.db)
        .collection(tmrev.collection.tmdb);

      const bulk = tmdbMoviesDb.initializeUnorderedBulkOp();

      const result = await db
        .aggregate([
          {
            $match: {
              _id: id,
            },
          },
          {
            $lookup: {
              from: "tmdb_movies",
              localField: "movies",
              foreignField: "id",
              as: "movieData",
            },
          },
        ])
        .toArray();

      const firstResult = result[0];
      const { movies, movieData } = firstResult;

      if (movies.length !== movieData.length) {
        // identify the missing movies

        const missingMovies = movies.filter(
          (movieId: number) =>
            !movieData.some((movie: any) => movieId === movie.id)
        );

        // make request to tmdb for missing movies
        const moviePromise: Array<Promise<Movie>> = missingMovies.map(
          (movie: number) => getDetails(movie, false)
        );

        const movieResolved = await Promise.allSettled(moviePromise);

        // add missing movies to array

        movieResolved.forEach((movie) => {
          if (movie.status === "fulfilled") {
            firstResult.movieData.push(movie.value);
            bulk
              .find({ id: movie.value.id })
              .upsert()
              .replaceOne({ ...movie.value });
          }
        });
        // add missing movies to db
      }

      if ((bulk as any).length > 0) {
        bulk.execute();
      }

      return result[0];
    };

    if (authToken) {
      const user = await getAuth().verifyIdToken(authToken);

      const result = await fetchResult();

      if (!result) throw new Error("Watchlist is either private or removed");

      if (result.public) {
        return result;
      }
      if (result.userId === user.uid) {
        return result;
      }
      throw new Error("Watchlist is either private or removed");
    } else {
      const result = await fetchResult();

      if (!result) {
        throw new Error("Watchlist is either private or removed");
      }

      return result;
    }
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getWatchListService;
