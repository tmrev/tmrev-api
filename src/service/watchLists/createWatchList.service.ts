import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import updateMovies from "../../functions/updateMovies";

export type ListData = {
  description: string;
  movies?: { order: number; tmdbID: number }[];
  public: boolean;
  tags: string[];
  title: string;
};

export const createWatchListService = async (
  authToken: string,
  data: ListData
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    data.movies?.forEach(async (movie) => {
      updateMovies(movie.tmdbID);
    });

    const newWatchList = {
      tags: data.tags,
      public: data.public,
      description: data.description,
      title: data.title,
      movies: data.movies || [],
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
