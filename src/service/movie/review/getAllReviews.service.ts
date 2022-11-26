import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import getAvgScoreService from "../../movieReviews/getAvgScore.service";

const getAllReviewsService = async (movieId: number) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const watchedDB = client.db(tmrev.db).collection(tmrev.collection.watched);

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

    const avgScore = await getAvgScoreService(movieId);

    return {
      success: true,
      body: {
        reviews: tmrevMovie,
        avgScore: avgScore.body || null,
        likes: likes.length,
        dislikes: dislikes.length,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getAllReviewsService;
