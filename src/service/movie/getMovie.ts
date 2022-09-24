import getDetails from "../../endpoints/tmdb/getDetails";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import getImdbMovie from "../imdb/getMedia.service";
import getAvgScoreService from "../movieReviews/getAvgScore.service";

const getMovie = async (movieId: number) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const watchedDB = client.db(tmrev.db).collection(tmrev.collection.watched);

    const tmdbMovie = await getDetails(movieId);
    const tmrevMovie = await db
      .aggregate([
        {
          $match: {
            tmdbID: movieId,
            public: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "uuid",
            as: "profile",
          },
        },
        {
          $unwind: {
            path: "$profile",
          },
        },
      ])
      .toArray();
    const ratings = await watchedDB.find({ tmdbID: Number(movieId) }).toArray();

    const likes = [];
    const dislikes = [];

    ratings.forEach((value) => {
      if (value.liked) {
        likes.push(value);
      } else {
        dislikes.push(value);
      }
    });

    if (!tmdbMovie) throw new Error("Movie not found");

    const imdbMovie = await getImdbMovie(tmdbMovie.imdb_id);
    const avgScore = await getAvgScoreService(tmdbMovie.id);

    return {
      success: true,
      body: {
        ...tmdbMovie,
        tmrev: {
          reviews: tmrevMovie,
          avgScore: avgScore.body || null,
          likes: likes.length,
          dislikes: dislikes.length,
        },
        imdb: imdbMovie,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error,
    };
  }
};

export default getMovie;
