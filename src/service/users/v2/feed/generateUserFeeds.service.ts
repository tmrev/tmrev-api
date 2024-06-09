import { client } from "../../../..";
import createFeed from "../../../../functions/feed/createFeed";
import postReviewV2 from "../../../../functions/feed/updateFeed/postReviewV2";
import { tmrev } from "../../../../models/mongodb";

const generateUserFeedsService = async () => {
  try {
    const usersDB = client.db(tmrev.db).collection(tmrev.collection.users);
    const reviewsDB = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const allUsers = await usersDB.find().toArray();
    const allReviews = await reviewsDB.find().toArray();

    const createFeeds = allUsers.map((user) => createFeed(user._id));

    await Promise.all(createFeeds);

    allReviews.forEach(async (review) => {
      const user = await usersDB.findOne({ uuid: review.userId });

      if (user) {
        await postReviewV2(review._id, user._id, user.followers);
      }
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default generateUserFeedsService;
