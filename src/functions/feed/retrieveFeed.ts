import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const retrieveFeed = async (userId: string) => {
  const userDB = await client.db(tmrev.db).collection(tmrev.collection.users);
  const feedDB = await client.db(tmrev.db).collection(tmrev.collection.feed);

  const user = await userDB.findOne({ _id: new ObjectId(userId) });

  const feed = await feedDB.findOne({ userId: user?._id });

  return feed;
};

export default retrieveFeed;
