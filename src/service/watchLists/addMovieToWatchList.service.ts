import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import getDetails from "../../endpoints/tmdb/getDetails";

const AddMovieToWatchList = async (
  authToken: string,
  list_id: string,
  data: {
    id: number;
  }
) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.watchlists);

    const id = new ObjectId(list_id);

    const watchList = await db.findOne({ _id: id, userId: user.uid });

    if (!watchList) {
      throw new Error("List does not exist");
    }

    const newWatchList = JSON.parse(JSON.stringify(watchList));

    const movieDetailResult = await getDetails(data.id, false);

    if (movieDetailResult) {
      const movieDetail = {
        tmdbId: movieDetailResult.id,
        backdrop_path: movieDetailResult.backdrop_path,
        budget: movieDetailResult.budget,
        genres: movieDetailResult.genres,
        id: movieDetailResult.id,
        imdb_id: movieDetailResult.imdb_id,
        original_language: movieDetailResult.original_language,
        poster_path: movieDetailResult.poster_path,
        release_date: movieDetailResult.release_date,
        revenue: movieDetailResult.revenue,
        runtime: movieDetailResult.runtime,
        title: movieDetailResult.title,
      };

      newWatchList.movies.push(movieDetail);
    }

    newWatchList.updatedAt = new Date();
    if (newWatchList._id) {
      delete newWatchList._id;
    }

    const result = await db.updateOne(
      { _id: id, userId: user.uid },
      { $set: newWatchList }
    );

    return result;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default AddMovieToWatchList;
