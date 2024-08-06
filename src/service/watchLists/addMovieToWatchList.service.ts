import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import updateMovies from "../../functions/updateMovies";

const AddMovieToWatchList = async (
  authToken: string,
  list_id: string,
  data: {
    id: number;
  }
) => {
  try {
    updateMovies(data.id);

    const watchListDB = client
      .db(tmrev.db)
      .collection(tmrev.collection.watchlists);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    const firebaseUser = await getAuth().verifyIdToken(authToken);

    if (!firebaseUser) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    if (!user) {
      return {
        success: false,
        error: "User does not exist",
      };
    }

    if (user.uuid !== firebaseUser.uid) {
      return {
        success: false,
        error: "User does not have permission to add movie to watchlist",
      };
    }

    const id = new ObjectId(list_id);

    const watchList = await watchListDB.findOne({
      _id: id,
      userId: firebaseUser.uid,
    });

    if (!watchList) {
      return {
        success: false,
        error: "Watchlist not found",
      };
    }

    // check if movie already exists in the watchlist
    const movieExists = watchList.movies.find(
      (movie: any) => movie.tmdbID === data.id
    );

    if (movieExists) {
      return {
        success: false,
        error: "Movie already exists in the watchlist",
      };
    }

    const movieOrder = watchList.movies.length;

    // push movie to the end of the movies array in the watchlist and give order of the last movie + 1
    await watchListDB.updateOne(
      { _id: id },
      {
        $push: {
          movies: {
            tmdbID: data.id,
            order: movieOrder,
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    );

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: err,
    };
  }
};

export default AddMovieToWatchList;
