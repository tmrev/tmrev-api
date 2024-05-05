// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

type User = {
  bio: string;
  createdAt: Date;
  email: string;
  firstName: string;
  followers: string[];
  following: string[];
  lastName: string;
  link: string | null;
  location: string;
  photoUrl: string | null;
  public: boolean;
  updatedAt: Date;
  uuid: string;
};

const createUserService = async (authToken: string, body: any) => {
  try {
    await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);
    const feedDB = client.db(tmrev.db).collection(tmrev.collection.feed);

    const user: User = {
      bio: body.bio,
      createdAt: new Date(),
      email: body.email.toLowerCase(),
      firstName: body.firstName,
      followers: [],
      following: [],
      lastName: body.lastName,
      link: body.link,
      location: body.location,
      photoUrl: body.photoUrl,
      public: body.public,
      updatedAt: new Date(),
      uuid: body.uuid,
    };

    const { insertedId } = await db.insertOne(user);

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
    console.error(error);
    return {
      success: false,
      error,
    };
  }
};

export default createUserService;
