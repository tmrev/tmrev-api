// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { ObjectId } from "mongodb";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const getReviewService = async (authToken: string, uuid: string) => {
  try {
    const user = await getAuth().verifyIdToken(authToken);

    const db = client.db(tmrev.db).collection(tmrev.collection.reviews);

    const id = new ObjectId(uuid);

    const result = await db.findOne({ _id: id, userId: user.uid });

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
