import { getAuth } from "firebase-admin/auth";
import {
  CreateMoviePayload,
  CreateMovieReviewV2Document,
} from "../../../models/movieReviews";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import postReviewFeed from "../../../functions/feed/updateFeed/postReview";
import getDetails from "../../../endpoints/tmdb/getDetails";

const createReviewService = async (
  data: CreateMoviePayload,
  authToken: string
) => {
  try {
    const dbReviews = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);

    let { movieDetails } = data;

    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const dbUser = await dbUsers.findOne({ uuid: firebaseUser.uid });

    const getAvg = () => {
      const allValues = Object.values(data.advancedScore);
      const sum = allValues.reduce((prev, curr) => prev + curr, 0);

      return sum / allValues.length;
    };

    const doesMovieDetailsExist = data.movieDetails !== undefined;

    if (!doesMovieDetailsExist) {
      const movieResults = await getDetails(data.tmdbID, false);

      if (movieResults) {
        movieDetails = {
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
      }
    }

    const payload: CreateMovieReviewV2Document = {
      userId: firebaseUser.uid,
      averagedAdvancedScore: getAvg(),
      notes: data.notes,
      tmdbID: data.tmdbID,
      advancedScore: data.advancedScore,
      public: data.public,
      title: data.title,
      votes: {
        upVote: [],
        downVote: [],
      },
      movieDetails: movieDetails!,
      createdAt: new Date(),
      updatedAt: new Date(),
      reviewedDate: data.reviewedDate,
    };

    const created = await dbReviews.insertOne(payload);

    if (dbUser && created) {
      await postReviewFeed(payload, dbUser, dbUser.followers);
    }

    const result = await dbReviews.findOne({ _id: created.insertedId });

    return {
      success: true,
      body: result,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err,
    };
  }
};

export default createReviewService;
