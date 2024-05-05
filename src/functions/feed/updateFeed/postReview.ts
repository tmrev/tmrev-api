import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { MongoMoviePayload } from "../../../models/movieReviews";

const postReviewFeed = async (
  review: MongoMoviePayload,
  author: any,
  followers: ObjectId[]
) => {
  try {
    // Prepare the operations for bulkWrite
    const updateOps = followers.map((followerId: ObjectId) => ({
      updateOne: {
        filter: { userId: followerId },
        update: {
          $push: {
            reviews: {
              $each: [{ reviewData: review, author, timestamp: new Date() }],
              $sort: { timestamp: -1 },
              $slice: 100, // Store only the 100 most recent items to prevent the feed from growing indefinitely
            },
          },
        },
      },
    }));

    // Execute bulkWrite
    await client
      .db(tmrev.db)
      .collection(tmrev.collection.feed)
      .bulkWrite(updateOps as any);
  } catch (err) {
    console.error(err);
  }
};

export default postReviewFeed;
