import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

async function postReviewV2(
  reviewId: ObjectId,
  author: ObjectId,
  followers: string[]
) {
  try {
    // Prepare the operations for bulkWrite
    const updateOps = followers.map((followerId: string) => ({
      updateOne: {
        filter: { userId: new ObjectId(followerId) }, // Convert followerId to ObjectId
        update: {
          $push: {
            reviews: {
              $each: [
                {
                  reviewData: reviewId,
                  author,
                  createdAt: new Date(),
                  seen: false,
                },
              ],
              $sort: { createdAt: -1 },
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
}

export default postReviewV2;
