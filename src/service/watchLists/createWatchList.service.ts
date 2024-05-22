import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import { MovieDetails } from "../../models/movieReviews";
import getDetails from "../../endpoints/tmdb/getDetails";

export type ListData = {
  description: string;
  movies?: number[] | MovieDetails[];
  public: boolean;
  tags: string[];
  title: string;
};

export const createWatchListService = async (
  authToken: string,
  data: ListData
) => {
  try {
    const movies: MovieDetails[] = [];

    const user = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    data.movies?.forEach(async (movie) => {
      if (typeof movie === "number") {
        const movieResults = await getDetails(movie, false);

        if (!movieResults) return;

        const movieDetail = {
          tmdbId: movieResults.id,
          backdrop_path: movieResults.backdrop_path,
          budget: movieResults.budget,
          genres: movieResults.genres,
          id: movieResults.id,
          imdb_id: movieResults.imdb_id,
          original_language: movieResults.original_language,
          poster_path: movieResults.poster_path,
          release_date: movieResults.release_date,
          revenue: movieResults.revenue,
          runtime: movieResults.runtime,
          title: movieResults.title,
        };

        movies.push(movieDetail);
      } else {
        movies.push(movie);
      }
    });

    const newWatchList = {
      tags: data.tags,
      public: data.public,
      description: data.description,
      title: data.title,
      movies,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.uid,
    };

    const result = await db.insertOne(newWatchList);

    const watchList = await db.findOne({ _id: result.insertedId });

    return watchList;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};
