import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const updateFeed = async (reviewId: ObjectId, followers: string[]) => {
  const feedDB = client.db(tmrev.db).collection(tmrev.collection.feed);

  await (feedDB as any).updateMany(
    { userId: { $in: followers } },
    { $push: { reviews: reviewId } }
  );
};

export default updateFeed;
