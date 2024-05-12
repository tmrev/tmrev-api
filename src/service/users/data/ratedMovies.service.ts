// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { client } from "../../..";
import { tmrev } from "../../../models/mongodb";

const ratedUserMoviesService = async (
  uid: string,
  authToken: string | null
) => {
  try {
    let firebaseUser: DecodedIdToken | null = null;
    let authUser: any;

    if (authToken) {
      firebaseUser = await getAuth().verifyIdToken(authToken);
      authUser = await client
        .db(tmrev.db)
        .collection(tmrev.collection.users)
        .findOne({ uuid: firebaseUser?.uid });
    }
    const dbUser = await client.db(tmrev.db).collection(tmrev.collection.users);
    const dbReviews = await client
      .db(tmrev.db)
      .collection(tmrev.collection.reviews);

    const user = await dbUser.findOne({ uuid: uid });

    if (!user) {
      return {
        success: false,
        error: "unable to find user",
      };
    }

    let findQuery: any = {
      userId: user.uuid,
      averagedAdvancedScore: { $ne: null },
    };

    if (authUser?.uuid !== user.uuid) {
      findQuery = { ...findQuery, public: true };
    }

    const highestReviews = await dbReviews
      .find(findQuery)
      .sort({ averagedAdvancedScore: -1 })
      .limit(10)
      .toArray();

    const lowestReviews = await dbReviews
      .find(findQuery)
      .sort({ averagedAdvancedScore: 1 })
      .limit(10)
      .toArray();

    return {
      success: true,
      body: {
        highest: highestReviews,
        lowest: lowestReviews,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default ratedUserMoviesService;
