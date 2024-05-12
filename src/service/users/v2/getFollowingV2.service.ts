import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";
import { GetFollowersV2Query } from "./getFollowersV2.service";

const getFollowingV2Service = async (
  userId: string,
  query: GetFollowersV2Query,
  authToken?: string
) => {
  try {
    let firebaseUser: DecodedIdToken | null;
    let authUser: any;

    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
      authUser = await db.findOne({ uuid: firebaseUser.uid });
    }

    const dbUser = await db.findOne({ uuid: userId });

    if (!dbUser) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    if (!dbUser.public) {
      if (!authUser || authUser.uuid !== dbUser.uuid) {
        return {
          success: false,
          error: "user is private",
        };
      }
    }

    const listOfFollowers = dbUser.following;

    if (!listOfFollowers) {
      return {
        success: false,
        error: "no followers found",
      };
    }

    let followers: any[] = [];

    if (query.search) {
      followers = await db
        .find({
          _id: { $in: listOfFollowers },
          $or: [
            { firstName: { $regex: query.search, $options: "i" } },
            { lastName: { $regex: query.search, $options: "i" } },
          ],
        })
        .toArray();
    } else {
      followers = await db
        .find({
          _id: { $in: listOfFollowers },
        })
        .toArray();
    }

    return {
      success: true,
      body: followers,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default getFollowingV2Service;
