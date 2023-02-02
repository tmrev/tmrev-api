import { Document } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { GetMovieReviewQuery } from "../../../models/movieReviews";
import getAvgScoreService from "../../movieReviews/getAvgScore.service";

const convertOrder = (order: "asc" | "desc" | string) => {
  if (order === "asc") return 1;
  if (order === "desc") return -1;

  return 0;
};

const getAllReviewsService = async (
  movieId: number,
  query: GetMovieReviewQuery
) => {
  try {
    let userReview: Document[] = [];
    const { count, skip, sort_by, include_user_review } = query;
    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const watchedDB = client.db(tmrev.db).collection(tmrev.collection.watched);

    const pipeline: Document[] = [];

    pipeline.push({
      $match: {
        tmdbID: movieId,
        public: true,
      },
    });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "uuid",
        as: "profile",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$profile",
      },
    });

    if (sort_by) {
      const [name, order, category] = sort_by.split(".");

      if (category) {
        pipeline.push({
          $sort: {
            [`${category}.${name}`]: convertOrder(order),
          },
        });
      } else {
        pipeline.push({
          $sort: {
            [name]: convertOrder(order),
          },
        });
      }
    }

    if (skip) {
      pipeline.push({
        $skip: skip,
      });
    }

    if (count) {
      pipeline.push({
        $limit: count,
      });
    }

    if (include_user_review) {
      const singleUserPipeline: Document[] = [
        {
          $match: {
            userId: include_user_review,
            tmdbID: movieId,
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
      ];
      const review = await db.aggregate(singleUserPipeline).toArray();
      if (review.length) {
        // eslint-disable-next-line prefer-destructuring
        userReview = [...review];
      }
    }

    const allReviews = await db.find({ tmdbID: Number(movieId) }).toArray();
    const tmrevMovie = await db.aggregate(pipeline).toArray();
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
        reviews:
          userReview.length && include_user_review
            ? [...userReview, ...tmrevMovie]
            : tmrevMovie,
        avgScore: avgScore.body || null,
        likes: likes.length,
        dislikes: dislikes.length,
        total: allReviews.length,
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
