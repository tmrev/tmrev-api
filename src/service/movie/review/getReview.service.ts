// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { Document, ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { customProjectMovieDetailsPipeline } from "../../../constants/pipelines";

const getReviewService = async (authToken: string, reviewId: string) => {
  try {
    const firebaseUser = await getAuth().verifyIdToken(authToken);

    const reviewDB = client.db(tmrev.db).collection(tmrev.collection.reviews);
    const userDB = client.db(tmrev.db).collection(tmrev.collection.users);

    const user = await userDB.findOne({ uuid: firebaseUser.uid });

    const pipeline: Document[] = [
      {
        $match: {
          _id: new ObjectId(reviewId),
        },
      },
      {
        $lookup: {
          from: tmrev.collection.users,
          localField: "userId",
          foreignField: "uuid",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      ...customProjectMovieDetailsPipeline({
        user: {
          _id: 1,
          uuid: 1,
          username: 1,
          photoUrl: 1,
        },
        votes: 1,
      }),
    ];

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const results = await reviewDB.aggregate(pipeline).toArray();

    const result = results[0];

    if (!result) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    if (!result.public && result.userId !== user.uuid) {
      return {
        success: false,
        error: "Review is private",
      };
    }

    return {
      success: true,
      body: result,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default getReviewService;
