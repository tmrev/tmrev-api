// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const createUserService = async (authToken: string, body: any) => {
  try {
    await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);
    const feedDB = client.db(tmrev.db).collection(tmrev.collection.feed);

    const { insertedId } = await db.insertOne(body);

    const feed = {
      reviews: [],
      comments: [],
      polls: [],
      lists: [],
      watched: [],
      userId: insertedId,
    };

    await feedDB.insertOne(feed);

    return "success";
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default createUserService;
