import { ObjectId } from "mongodb";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

async function createFeed(userId: ObjectId) {
  const feedDB = client.db(tmrev.db).collection(tmrev.collection.feed);

  const feed = {
    reviews: [],
    comments: [],
    polls: [],
    lists: [],
    watched: [],
    userId,
  };

  await feedDB.insertOne(feed);
}

export default createFeed;
