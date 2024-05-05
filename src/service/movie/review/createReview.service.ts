// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import {
  CreateMoviePayload,
  MongoMoviePayload,
} from "../../../models/movieReviews";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { timestamp } from "../../../utils/common";
import postReviewFeed from "../../../functions/feed/updateFeed/postReview";

const createReviewService = async (
  data: CreateMoviePayload,
  authToken: string
) => {
  try {
    const dbReviews = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const dbUsers = client.db(tmrev.db).collection(tmrev.collection.users);

    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const dbUser = await dbUsers.findOne({ uuid: firebaseUser.uid });

    const getAvg = () => {
      const allValues = Object.values(data.advancedScore);
      const sum = allValues.reduce((prev, curr) => prev + curr, 0);

      return sum / allValues.length;
    };

    const payload: MongoMoviePayload = {
      createdAt: timestamp(),
      updatedAt: timestamp(),
      userId: firebaseUser.uid,
      averagedAdvancedScore: getAvg(),
      user: dbUser?._id,
      notes: data.notes,
      tmdbID: data.tmdbID,
      reviewedDate: data.reviewedDate,
      advancedScore: data.advancedScore,
      public: data.public,
      release_date: data.release_date,
      title: data.title,
      votes: {
        upVote: [],
        downVote: [],
      },
      moviePoster: data.moviePoster,
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
