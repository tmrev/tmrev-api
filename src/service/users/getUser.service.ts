// eslint-disable-next-line import/no-unresolved
import { getAuth } from "firebase-admin/auth";
import { client } from "../..";
import { tmrev } from "../../models/mongodb";

const getUserService = async (uuid: string) => {
  try {
    const user = await getAuth().getUser(uuid);
    const db = client.db(tmrev.db).collection(tmrev.collection.users);

    const pipeline = [
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
    ];

    const result = await db.aggregate(pipeline).toArray();

    return {
      displayName: user.displayName,
      photoUrl: user.photoURL,
      email: user.email,
      ...result[0],
    };
  } catch (error) {
    return {
      error,
    };
  }
};

export default getUserService;
