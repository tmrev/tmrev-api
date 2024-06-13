import { getAuth } from "firebase-admin/auth";
import { generateFromEmail } from "unique-username-generator";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";
import createFeed from "../../functions/feed/createFeed";

type User = {
  bio: string;
  createdAt: Date;
  email: string;
  followers: string[];
  following: string[];
  link: string | null;
  location: string;
  photoUrl: string | null;
  public: boolean;
  updatedAt: Date;
  username: string;
  uuid: string;
};

type CreateUser = {
  bio: string;
  email: string;
  link: string | null;
  location: string;
  photoUrl: string | null;
  public: boolean;
  username: string;
};

const createUserService = async (authToken: string, body: CreateUser) => {
  try {
    let { username } = body;
    const firebaseUser = await getAuth().verifyIdToken(authToken);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    if (!username) {
      username = generateFromEmail(body.email);
    }

    const user: User = {
      bio: body.bio,
      createdAt: new Date(),
      username,
      email: body.email.toLowerCase(),
      followers: [],
      following: [],
      link: body.link,
      location: body.location,
      photoUrl: body.photoUrl,
      public: body.public,
      updatedAt: new Date(),
      uuid: firebaseUser.uid,
    };

    const { insertedId } = await db.insertOne(user);

    await createFeed(insertedId);

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

export default createUserService;
