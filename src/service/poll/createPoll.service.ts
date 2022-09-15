// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
// eslint-disable-next-line import/no-unresolved
import { Timestamp } from "firebase-admin/firestore";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

export type Categories = {
  title: string;
  tmdbId: number;
  votes: string[];
};
export interface CreatePollPayload {
  categories: Categories[];
  description: string;
  title: string;
}

const createPollService = async (
  authToken: string,
  payload: CreatePollPayload
) => {
  try {
    const db = client.db(tmrev.db).collection(tmrev.collection.poll);
    const user = await getAuth().verifyIdToken(authToken);

    const modPayload = {
      ...payload,
      creator: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      active: true,
    };

    const { insertedId } = await db.insertOne(modPayload);

    const result = await db.findOne({ _id: insertedId });

    return result;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default createPollService;
