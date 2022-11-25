// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getUserService = async (uuid: string) => {
  try {
    const user = await getAuth().getUser(uuid);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const userPipeline = [
      {
        $match: {
          uuid,
        },
      },
      {
        $lookup: {
          from: tmrev.collection.reviews,
          localField: "uuid",
          foreignField: "userId",
          as: "reviews",
        },
      },
      {
        $lookup: {
          from: tmrev.collection.watchlists,
          localField: "uuid",
          foreignField: "userId",
          as: "watchLists",
        },
      },
      {
        $lookup: {
          from: tmrev.collection.watched,
          localField: "uuid",
          foreignField: "userId",
          as: "watched",
        },
      },
    ];

    const followerPipeline = [
      {
        $match: {
          following: uuid,
        },
      },
      {
        $count: "followers",
      },
    ];

    const result = await db.aggregate(userPipeline).toArray();
    const followerCount = await db.aggregate(followerPipeline).toArray();

    return {
      displayName: user.displayName,
      photoUrl: user.photoURL,
      email: user.email,
      ...followerCount[0],
      ...result[0],
    };
  } catch (error) {
    return {
      error,
    };
  }
};

export default getUserService;
